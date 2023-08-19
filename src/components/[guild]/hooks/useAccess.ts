import useGuild from "components/[guild]/hooks/useGuild"
import { SWRConfiguration } from "swr"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import useUser from "./useUser"

type FlowCreationResponse = { jobId: string }

const ACCESS_FLOW_POLL_MS = 1000

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

type FlowResult = {
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
): RoleId extends number
  ? BaseAccessReturnType<AccessCheckResult>
  : BaseAccessReturnType<AccessCheckResult[]> => {
  const { id: guildId } = useGuild()
  const { id: userId } = useUser()

  const fetcherWithSign = useFetcherWithSign()

  const pollParams = new URLSearchParams({ guildId: `${guildId}` }).toString()

  const { data: flowId, mutate: mutateFlowId } = useSWRImmutable<string>(
    ["accessFlowId", guildId],
    () => undefined,
    {
      revalidateOnMount: false,
    }
  )

  const setFlowId = (data: string) => mutateFlowId(data, { revalidate: false })

  const shouldFetch = userId && guildId && roleId !== 0

  const pollKey = shouldFetch
    ? ([`/v2/actions/access-check?${pollParams}`, { method: "GET" }] as const)
    : null

  const poll = useSWRImmutable<FlowResult>(
    pollKey,
    (props: typeof pollKey) =>
      fetcherWithSign([...props]).then(async (result: FlowResult[]) => {
        if (!Array.isArray(result) || result.length <= 0) {
          await setFlowId(null)
          return null
        }

        if (flowId?.length > 0) {
          const foundFlow = result.find(({ id }) => id === flowId)
          // If the tracked flow has been finished, we mark the flowId as undefined, so no polling will happen (refreshInterval will be undefined), and we don't start a new flow (explicit null-check)
          await setFlowId(foundFlow.done ? undefined : foundFlow.id)
          if (foundFlow) return foundFlow
        }
        const nonDoneFlow = result.find(({ done }) => !done)
        if (nonDoneFlow) {
          await setFlowId(nonDoneFlow.id)
          return nonDoneFlow
        }

        await setFlowId(null)
        return null
      }),
    {
      ...swrOptions,
      onSuccess: (val) => console.log("POLL", val),
      refreshInterval: !!flowId ? ACCESS_FLOW_POLL_MS : undefined,
    }
  )

  // Explicit null check to differenciate from initial undefined
  const shouldFechFlowCreation = flowId === null
  const flowCreation = useSWRImmutable(
    shouldFechFlowCreation
      ? [`/v2/actions/access-check`, { method: "POST", body: { guildId } }]
      : null,
    (props) =>
      setFlowId(null)
        .then(() => poll.mutate(undefined, { revalidate: false }))
        .then(() =>
          fetcherWithSign(props).then(({ jobId }: FlowCreationResponse) =>
            setFlowId(jobId)
          )
        ),
    {
      ...swrOptions,
      onSuccess: (createdFlowId) => console.log("CREATED", createdFlowId),
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
    error: poll.error ?? flowCreation.error,
    hasAccess,
    isLoading: !accessCheckResult,
    mutate: () => flowCreation.mutate(),
  }
}

export default useAccess
