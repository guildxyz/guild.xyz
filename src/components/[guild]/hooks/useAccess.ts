import useGuild from "components/[guild]/hooks/useGuild"
import useFlow from "hooks/useFlow"

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
  newAccessFlowIntervalMs?: number
): BaseAccessReturnType<
  RoleId extends number ? AccessCheckResult : AccessCheckResult[]
> => {
  const { id: guildId } = useGuild()

  const poll = useFlow<Job>(
    `/v2/actions/access-check`,
    { guildId },
    { guildId: `${guildId}` },
    guildId && roleId !== 0,
    { creationPollMs: newAccessFlowIntervalMs }
  )

  const accessCheckResult = poll.data?.accessCheckResult ?? null

  const roleData =
    roleId && accessCheckResult?.find?.((role) => role.roleId === roleId)

  const hasAccess = roleId
    ? roleData?.access
    : accessCheckResult?.some?.(({ access }) => access)

  return {
    data: (roleData ?? accessCheckResult) as any,
    error: poll.error,
    hasAccess,
    isLoading: !accessCheckResult,
    mutate: () => poll.mutate(),
  }
}

export default useAccess
