import type { JoinJob } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useMembership from "components/explorer/hooks/useMembership"
import useSubmit from "hooks/useSubmit"
import { useUserRewards } from "hooks/useUserRewards"
import { useState } from "react"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import mapAccessJobState, { groupBy } from "../utils/mapAccessJobState"

export type JoinData = {
  oauthData: any
}

const useMembershipUpdate = (
  onSuccess?: (response: JoinJob) => void,
  onError?: (error?: any) => void
) => {
  const guild = useGuild()
  const { mutate: mutateMembership } = useMembership()
  const { mutate: mutateUserRewards } = useUserRewards()
  const fetcherWithSign = useFetcherWithSign()
  const [pollState, setPollState] = useState<"INITIAL" | "POLL" | "FINISHED">(
    "INITIAL"
  )
  const { captureEvent } = usePostHogContext()
  const posthogOptions = {
    guild: guild.urlName,
  }

  const submit = async (data): Promise<string> => {
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
    onSuccess: () => setPollState("POLL"),
    onError: (error) => {
      captureEvent(`Guild join error`, { ...posthogOptions, error })
      onError?.(error)
    },
  })

  const onFinish = (response: JoinJob) => {
    if (!response.roleAccesses?.some((role) => role.access === true)) return

    // Mutate guild in case the user sees more entities due to visibilities
    guild.mutateGuild()

    mutateUserRewards()

    onSuccess?.(response)

    setTimeout(() => {
      setPollState("INITIAL")
    }, 3000)
  }

  const progress = useSWRImmutable<JoinJob>(
    pollState === "POLL"
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

        if (!!res?.roleAccesses && res.roleAccesses.every((role) => !role.access)) {
          setPollState("FINISHED")
          return
        }

        if (res?.done) {
          setPollState("FINISHED")
          onFinish(res)
        }
      },
      /**
       * Needed to keep the response, even tough shouldFetchProgress gets set to
       * false because of reseting useSubmitResponse
       */
      keepPreviousData: true,
      refreshInterval: pollState === "POLL" ? 500 : undefined,
    }
  )

  const isLoading = useSubmitResponse?.isLoading || pollState === "POLL"

  return {
    isFinished: pollState === "FINISHED",
    isLoading,
    error: pollState === "FINISHED" && progress?.data?.failedErrorMsg,
    joinProgress:
      (isLoading || pollState === "FINISHED") &&
      mapAccessJobState(progress.data, isLoading),
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
