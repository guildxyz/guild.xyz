import useGuild from "components/[guild]/hooks/useGuild"
import { SWRConfiguration } from "swr"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import useUser from "./useUser"

type JobCreationResponse = { jobId: string }

const ACCESS_JOB_POLL_MS = 1000

type RequirementAccessResult = {
  requirementId: number
  access: boolean
  amount?: number
}

type AccessCheckResult = {
  roleId: number
  requirements: RequirementAccessResult[]
  access: boolean
  errors: any[]
}

type Job = {
  id: string
  roleIds: number[]
  accessCheckResult: AccessCheckResult[]
  userId: number
  guildId: number
  recheckAccess: boolean
  updateMemberships: boolean
  "completed-queue": string // "access-result", TODO: Proper string union type here
  forceRewardActions: boolean
  manageRewards: boolean
  done: boolean
}

type BaseAccessReturnType<Data> = {
  data: Data
  error: any
  hasAccess: boolean
  isLoading: boolean
  mutate: () => Promise<string>
}

const useAccess = <RoleId extends number | "UNSET" = "UNSET">(
  roleId: RoleId = undefined,
  swrOptions?: SWRConfiguration
): BaseAccessReturnType<
  RoleId extends number ? AccessCheckResult : AccessCheckResult[]
> => {
  const { id: guildId } = useGuild()
  const { id: userId } = useUser()

  const fetcherWithSign = useFetcherWithSign()

  const pollParams = new URLSearchParams({ guildId: `${guildId}` }).toString()

  const { data: jobId, mutate: mutatejobId } = useSWRImmutable<string>(
    ["accessjobId", guildId],
    () => undefined,
    {
      revalidateOnMount: false,
    }
  )

  const setjobId = (data: string) => mutatejobId(data, { revalidate: false })

  const poll = useSWRImmutable(
    userId && guildId && roleId !== 0
      ? [`/v2/actions/access-check?${pollParams}`, { method: "GET" }]
      : null,
    (props) =>
      fetcherWithSign(props).then(async (result: Job[]) => {
        if (Array.isArray(result) && result.length > 0) {
          if (jobId?.length > 0) {
            const foundJob = result.find(({ id }) => id === jobId)
            // If the tracked job has been finished, we mark the jobId as undefined, so no polling will happen (refreshInterval will be undefined), and we don't start a new flow (explicit null-check)
            await setjobId(foundJob.done ? undefined : foundJob.id)
            if (foundJob) return foundJob
          }
          const nonDoneJob = result.find(({ done }) => !done)
          if (nonDoneJob) {
            await setjobId(nonDoneJob.id)
            return nonDoneJob
          }
        }

        await setjobId(null)
        return null
      }),
    {
      ...swrOptions,
      onSuccess: (val) => console.log("POLL", val),
      refreshInterval: !!jobId ? ACCESS_JOB_POLL_MS : undefined,
    }
  )

  const jobCreation = useSWRImmutable(
    // Explicit null check to differenciate from initial undefined
    jobId === null
      ? [`/v2/actions/access-check`, { method: "POST", body: { guildId } }]
      : null,
    (props) =>
      setjobId(null)
        .then(() => poll.mutate(undefined, { revalidate: false }))
        .then(() =>
          fetcherWithSign(props).then(
            ({ jobId: createdJobId }: JobCreationResponse) => setjobId(createdJobId)
          )
        ),
    {
      ...swrOptions,
      onSuccess: (createdjobId) => console.log("CREATED", createdjobId),
    }
  )

  const accessCheckResult = poll.data?.accessCheckResult ?? null

  const roleData =
    roleId && accessCheckResult?.find?.((role) => role.roleId === roleId)

  const hasAccess = roleId
    ? roleData?.access
    : accessCheckResult?.some?.(({ access }) => access)

  return {
    data: (roleData ?? accessCheckResult) as any,
    error: poll.error ?? jobCreation.error,
    hasAccess,
    isLoading: !accessCheckResult,
    mutate: () => jobCreation.mutate(),
  }
}

export default useAccess
