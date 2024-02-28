import type { JoinJob } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useMembership from "components/explorer/hooks/useMembership"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { atom, useAtom } from "jotai"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import { groupBy } from "../utils/mapAccessJobState"

const SUCCESS_EVENT_NAME = "MEMBERSHIP_UPDATE_SUCCESS"
const ERROR_EVENT_NAME = "MEMBERSHIP_UPDATE_ERROR"

const isPollingAtom = atom<boolean>(false)

type Props = UseSubmitOptions<JoinJob> & { keepPreviousData?: boolean }

const useActiveMembershipUpdate = ({
  keepPreviousData,
  onSuccess,
  onError,
}: Props = {}) => {
  const guild = useGuild()
  const fetcherWithSign = useFetcherWithSign()
  const { mutate: mutateMembership } = useMembership()
  const [shouldPoll, setShouldPoll] = useAtom(isPollingAtom)

  const progress = useSWRImmutable<JoinJob>(
    shouldPoll ? `/v2/actions/join?guildId=${guild?.id}` : null,
    (key) =>
      fetcherWithSign([key, { method: "GET" }]).then(
        (result: JoinJob[]) =>
          // casting to any until @guildxyz/types contains createdAtTimestamp
          result?.sort((jobA: any, jobB: any) =>
            jobA.createdAtTimestamp > jobB.createdAtTimestamp ? 1 : -1
          )?.[0]
      ),
    {
      onSuccess: (res) => {
        if (!res.done) return

        const byRoleId = groupBy(res?.["children:access-check:jobs"] ?? [], "roleId")

        const newRoles = Object.entries(byRoleId).map(([roleIdStr, reqJobs]) => {
          const roleId = +roleIdStr
          return {
            access: res?.roleAccesses?.find(
              (roleAccess) => roleAccess.roleId === +roleId
            )?.access,
            roleId,
            requirements: reqJobs?.map((reqJob) => ({
              requirementId: reqJob.requirementId,
              access: reqJob.access,
              amount: reqJob.amount,
              errorMsg: reqJob.userLevelErrors?.[0]?.msg,
              errorType: reqJob.userLevelErrors?.[0]?.errorType,
              subType: reqJob.userLevelErrors?.[0]?.subType,
              lastCheckedAt: reqJob.done ? new Date() : null,
            })),
          }
        })

        mutateMembership(
          (prev) => ({
            guildId: prev?.guildId,
            isAdmin: prev?.isAdmin,
            joinedAt: prev?.joinedAt || res?.done ? new Date().toISOString() : null,
            roles: [
              ...(prev?.roles?.filter(
                (role) => !Object.keys(byRoleId).includes(role.roleId.toString())
              ) ?? []),
              ...newRoles,
            ],
          }),
          { revalidate: false }
        )

        /**
         * Instead of calling onSuccess here, we call it in triggerMembershipUpdate,
         * when this event is catched. This is for making sure, the correct onSuccess
         * runs (the same one where we call triggerMembershipUpdate)
         */
        window.postMessage({ type: SUCCESS_EVENT_NAME, res })
        setShouldPoll(false)
      },
      onError: (err) => {
        window.postMessage({ type: ERROR_EVENT_NAME, err })
        setShouldPoll(false)
      },
      keepPreviousData,
      refreshInterval: shouldPoll ? 500 : undefined,
    }
  )

  return {
    ...progress,
    isValidating: shouldPoll,
    triggerPoll: () => {
      setShouldPoll(true)

      // this doesn't work for some reason, but leaving it here till we investigate
      progress.mutate(undefined, { revalidate: false })

      const listener = (event: MessageEvent<any>) => {
        if (event?.data?.type === SUCCESS_EVENT_NAME) {
          try {
            onSuccess?.(event?.data?.res)
            window.removeEventListener("message", listener)
          } catch {}
        }
        if (event?.data?.type === ERROR_EVENT_NAME) {
          try {
            onError?.(event?.data?.err)
            window.removeEventListener("message", listener)
          } catch {}
        }
      }

      window.addEventListener("message", listener)
    },
  }
}

export default useActiveMembershipUpdate
