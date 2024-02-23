import type { JoinJob } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useMembership from "components/explorer/hooks/useMembership"
import useSubmit from "hooks/useSubmit"
import { useUserRewards } from "hooks/useUserRewards"
import { atom, useAtom } from "jotai"
import useUsersPoints from "platforms/Points/useUsersPoints"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import mapAccessJobState, { groupBy } from "../utils/mapAccessJobState"

export type JoinData = {
  oauthData: any
}

const stateAtom = atom<"INITIAL" | "GETTING_JOB" | "POLLING" | "FINISHED">("INITIAL")

const useMembershipUpdate = (
  onSuccess?: (response: JoinJob) => void,
  onError?: (error?: any) => void,
  /**
   * We're setting keepPreviousData to true in useJoin, so we can display no access
   * and error states correctly. Would be nice to find a better solution for this
   * (like not parsing NO_ACCESS state and error in mapAccessJobState but storing
   * them separately).
   *
   * - Now when triggering access check after join, it'll start with a finished state
   *   (since we're keeping the progress state from join)
   * - The manual progress.mutate(undefined, { revalidate: false }) doesn't work for
   *   some reason
   */
  keepPreviousData = false
) => {
  const guild = useGuild()
  const { mutate: mutateMembership } = useMembership()
  const { mutate: mutateUserRewards } = useUserRewards()
  const { mutate: mutateUserPoints } = useUsersPoints()
  const fetcherWithSign = useFetcherWithSign()
  const [state, setState] = useAtom(stateAtom)
  const { captureEvent } = usePostHogContext()
  const posthogOptions = {
    guild: guild.urlName,
  }

  const submit = async (data): Promise<string> => {
    setState("GETTING_JOB")

    const initialPollResult: JoinJob[] = await fetcherWithSign([
      `/v2/actions/join?${new URLSearchParams({
        guildId: `${guild?.id}`,
      }).toString()}`,
      { method: "GET" },
    ]).catch(() => null as JoinJob[])

    const jobAlreadyInProgress = initialPollResult?.find((job) => !job.done)

    if (jobAlreadyInProgress) {
      return jobAlreadyInProgress?.id
    }

    const { jobId } = await fetcherWithSign([
      `/v2/actions/join`,
      { method: "POST", body: { guildId: guild?.id, ...(data ?? {}) } },
    ])
    return jobId
  }

  const useSubmitResponse = useSubmit(submit, {
    onSuccess: () => setState("POLLING"),
    onError: (error) => {
      setState("INITIAL")
      captureEvent(`Guild join error`, { ...posthogOptions, error })
      onError?.(error)
    },
  })

  const onFinish = (response: JoinJob) => {
    if (!response.roleAccesses?.some((role) => role.access === true)) return

    // mutate guild in case the user sees more entities due to visibilities
    guild.mutateGuild()

    mutateUserRewards()
    mutateUserPoints()

    onSuccess?.(response)

    setTimeout(() => {
      setState("INITIAL")
    }, 3000)
  }

  const progress = useSWRImmutable<JoinJob>(
    state === "POLLING"
      ? `/v2/actions/join?${new URLSearchParams({
          guildId: `${guild?.id}`,
        }).toString()}`
      : null,

    (key) =>
      fetcherWithSign([key, { method: "GET" }]).then(
        (result: JoinJob[]) => result?.[0]
      ),
    {
      onSuccess: (res) => {
        const byRoleId = groupBy(res?.["children:access-check:jobs"] ?? [], "roleId")

        // Mutate membership data according to join status
        mutateMembership(
          (prev) => {
            // In case the user is already a member, we only mutate when we have the whole data
            if (!!prev?.joinedAt && !res?.done) {
              return prev
            }

            return {
              guildId: prev?.guildId,
              isAdmin: prev?.isAdmin,
              joinedAt:
                prev?.joinedAt || res?.done ? new Date().toISOString() : null,
              roles: Object.entries(byRoleId).map(([roleIdStr, reqJobs]) => {
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
              }),
            }
          },
          { revalidate: false }
        )

        if (res?.failed) {
          onError?.(res.failedErrorMsg)
          setState("FINISHED")
          return
        }

        if (!!res?.roleAccesses && res.roleAccesses.every((role) => !role.access)) {
          setState("FINISHED")
          return
        }

        if (res?.done) {
          setState("FINISHED")
          onFinish(res)
        }
      },
      keepPreviousData,
      refreshInterval: state === "POLLING" ? 500 : undefined,
    }
  )

  const isLoading = state === "GETTING_JOB" || state === "POLLING"

  return {
    isFinished: state === "FINISHED",
    isLoading,
    error: state === "FINISHED" && progress?.data?.failedErrorMsg,
    joinProgress: state !== "INITIAL" && mapAccessJobState(progress.data, isLoading),
    triggerMembershipUpdate: (data?) => {
      progress.mutate(undefined, { revalidate: false })
      useSubmitResponse.onSubmit(data)
    },
    reset: () => {
      useSubmitResponse.reset()
      progress.mutate(undefined, { revalidate: false })
    },
  }
}

export default useMembershipUpdate
