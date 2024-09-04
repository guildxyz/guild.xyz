import type { AccessCheckJob, JoinJob } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useMembership from "components/explorer/hooks/useMembership"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import { UseSubmitOptions } from "hooks/useSubmit/types"
import { atom, useAtom } from "jotai"
import useSWRImmutable from "swr/immutable"
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

  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const progress = useSWRImmutable<JoinJob>(
    shouldPoll ? `/v2/actions/join?guildId=${guild?.id}` : null,
    (key) =>
      fetcherWithSign(getKeyForSWRWithOptionalAuth(key)).then(
        (result: JoinJob[]) =>
          // casting to any until @guildxyz/types contains createdAtTimestamp
          result?.sort((jobA: any, jobB: any) =>
            jobA.createdAtTimestamp > jobB.createdAtTimestamp ? -1 : 1
          )?.[0]
      ),
    {
      onSuccess: (res) => {
        if (!res.done) return

        /**
         * "children:access-check:jobs" are the jobs returned from gate, but in some
         * cases the user may get access to additional requirements after the initial
         * access check (e.g. if they get access to "role A" and that role is the
         * requirement in "role B", then this latter will be included only in
         * "res.requirementAccesses"), that's why we use this variable here
         */
        const requirementAccesses = (res as any)
          ?.requirementAccesses as AccessCheckJob["children:access-check:jobs"][]
        const reqJobsByRoleId = groupBy(requirementAccesses ?? [], "roleId")

        const newRoles = Object.entries(reqJobsByRoleId).map(
          ([roleIdStr, reqAccesses]: [
            string,
            AccessCheckJob["children:access-check:jobs"],
          ]) => {
            const roleId = +roleIdStr
            return {
              access: res?.roleAccesses?.find(
                (roleAccess) => roleAccess.roleId === +roleId
              )?.access,
              roleId,
              requirements: reqAccesses?.map((reqAccess) => ({
                requirementId: reqAccess.requirementId,
                access: reqAccess.access,
                amount: reqAccess.amount,
                errorMsg:
                  reqAccess.userLevelErrors?.[0]?.msg ??
                  reqAccess.requirementError?.msg,
                errorType:
                  reqAccess.userLevelErrors?.[0]?.errorType ??
                  reqAccess.requirementError?.errorType,
                subType:
                  reqAccess.userLevelErrors?.[0]?.errorSubType ??
                  reqAccess.requirementError?.errorSubType,
                lastCheckedAt: new Date(res.createdAtTimestamp).toISOString(),
              })),
            }
          }
        )

        // delaying success a bit so the user has time percieving the last state
        setTimeout(() => {
          mutateMembership(
            (prev) => ({
              guildId: prev?.guildId,
              isAdmin: prev?.isAdmin,
              joinedAt:
                prev?.joinedAt || res?.done ? new Date().toISOString() : null,
              roles: [
                ...(prev?.roles?.filter(
                  (role) => !(role.roleId.toString() in reqJobsByRoleId)
                ) ?? []),
                ...newRoles,
              ],
            }),
            { revalidate: false }
          )

          /**
           * Instead of calling onSuccess here, we call it in
           * triggerMembershipUpdate, when this event is catched. This is for making
           * sure, the correct onSuccess runs (the same one where we call
           * triggerMembershipUpdate)
           */
          window.postMessage({ type: SUCCESS_EVENT_NAME, res })
          setShouldPoll(false)
        }, 2000)
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
      // this doesn't work for some reason, but leaving it here till we investigate
      progress.mutate(null, { revalidate: false })

      setShouldPoll(true)

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
