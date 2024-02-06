import type { JoinJob } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useMembership from "components/explorer/hooks/useMemberships"
import useSubmit from "hooks/useSubmit"
import { atom, useSetAtom } from "jotai"
import useSWRImmutable from "swr/immutable"
import { PlatformName } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import mapAccessJobState, { groupBy } from "../utils/mapAccessJobState"

type PlatformResult = {
  platformId: number
  platformName: PlatformName
} & (
  | { success: true }
  | {
      success: false
      errorMsg: "Unknown Member"
      invite: string
    }
)

type Response = {
  success: boolean
  platformResults: PlatformResult[]
  accessedRoleIds: number[]
}

export type JoinData = {
  oauthData: any
}

/**
 * Temporary to show "You might need to wait a few minutes to get your roles" on the
 * Discord reward card after join until we implement queues generally
 */
export const isAfterJoinAtom = atom(false)

const useMembershipUpdate = (
  onSuccess?: (response: Response) => void,
  onError?: (error?: any) => void
) => {
  const { captureEvent } = usePostHogContext()

  const guild = useGuild()
  const user = useUser()

  const posthogOptions = {
    guild: guild.urlName,
  }

  const { mutate } = useMembership()
  const setIsAfterJoin = useSetAtom(isAfterJoinAtom)

  const fetcherWithSign = useFetcherWithSign()

  const submit = async (): Promise<string> => {
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
      { method: "POST", body: { guildId: guild?.id } },
    ])
    return jobId
  }

  const onJoinSuccess = (response: Response) => {
    // mutate user in case they connected new platforms during the join flow
    user?.mutate?.()

    // Mutate guild in case the user seed more entities after join due to visibilities
    guild.mutateGuild()

    onSuccess?.(response)

    if (!response.success) return

    // Not sure about this one, should we move this in useJoin's onSuccess?
    setIsAfterJoin(true)
  }

  const useSubmitResponse = useSubmit(submit, {
    onError: (error) => {
      captureEvent(`Guild join error`, { ...posthogOptions, error })
      onError?.(error)
    },
  })

  const getResponseByProgress = (progressRes) => ({
    success: progressRes.roleAccesses
      ? !!progressRes.roleAccesses?.some((role) => role.access === true)
      : undefined,
    accessedRoleIds: (progressRes.roleAccesses ?? [])
      .filter((roleAccess) => !!roleAccess?.access)
      .map(({ roleId }) => roleId),
    platformResults: [], // Not used
  })

  const shouldFetchProgress = !!useSubmitResponse?.response

  const progress = useSWRImmutable<JoinJob>(
    shouldFetchProgress
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
        mutate(
          (prev) => {
            // In case the user is already joined, and we just do an update, we only mutate, when we have the whole data
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
          useSubmitResponse?.reset()
          return
        }

        if (res?.done) {
          // With the timeout the UI is a bit cleaner, when we transition multiple states during one poll
          setTimeout(() => {
            useSubmitResponse?.reset()
            onJoinSuccess(getResponseByProgress(res))
          }, 2000)
        }
      },
      /**
       * Needed to keep the response, even tough shouldFetchProgress gets set to
       * false because of reseting useSubmitResponse
       */
      keepPreviousData: true,
      refreshInterval:
        typeof useSubmitResponse?.response === "string" ? 500 : undefined,
    }
  )

  const noAccess =
    progress?.data?.roleAccesses &&
    progress?.data?.roleAccesses?.every((role) => !role.access)

  const response =
    (progress?.data?.done && !(progress?.data as any)?.failed) || noAccess
      ? getResponseByProgress(progress?.data)
      : undefined

  const isLoading = useSubmitResponse?.isLoading || !!useSubmitResponse?.response

  const error = (progress?.data as any)?.failedErrorMsg

  const joinProgress =
    isLoading || noAccess ? mapAccessJobState(progress?.data) : undefined

  return {
    response,
    isLoading,
    error,
    progress: progress?.data,
    joinProgress,
    triggerMembershipUpdate: (data?) =>
      useSubmitResponse.onSubmit({
        guildId: guild?.id,
        shareSocials: data?.shareSocials,
        platforms:
          data &&
          Object.entries(data.platforms ?? {})
            .filter(([_, value]) => !!value)
            .map(([key, value]: any) => ({
              name: key,
              ...value,
            })),
      }),
    reset: () => {
      useSubmitResponse.reset()
      progress.mutate(undefined, { revalidate: false })
    },
  }
}

export default useMembershipUpdate
