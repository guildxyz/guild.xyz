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

// string    => A flowId, which we are polling, no need to start a new flow, we know what to poll
// null      => No ongoing (!done) flow exists, we should start a new flow
// undefined => The result of a flow is known, no need to poll nor to start a flow

/*
  Main changes:
    - Tried to improve type-safety. The return type of data was previously any, which I guess was because it either could be an array, or a single result object
      - The typing workaround is a bit hacky, but sadly typeof undefined is any (:cannot_be_undone:), so I couldn't find another way, but to bind a specific "UNSET" type by default
      - The only case it doesn't work is a call like this: useAccess(undefined, { ... }), because in this case typeof undefined is being bound to the type parameter whic is any. But this can be easyli woked around with a separate hook like this: `const useGuildAccess = (swrOptions) => useAccess<"UNSET">(undefined, swrOptions)`
    - Queue logic:
      1) Polling starts with one single request (not really polling yet at this point)
        - If the poll returns an ongoing access check, we use It's id to remember this fact
        - If it doesn't return an ongoing access check, we use null to signal that a new one should be created
      2) If the flowId is null, we create a new one, and set the resulting flowId (it is important to set this inside the fetcher, to ensure that in the next execution of the hook the id is set, and no more creation requests are made)
      3) If we have a flowId, we start polling by setting the refreshInterval parameter
    - The `setFlowId` calls insige the poll fetcher is also important to be there and not in onSuccess, to make sure it only runs once per request, and stays consistent

*/

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
