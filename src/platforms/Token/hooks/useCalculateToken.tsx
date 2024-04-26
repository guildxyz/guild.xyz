import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import useUser from "components/[guild]/hooks/useUser"
import useMembership from "components/explorer/hooks/useMembership"
import useTokenData from "hooks/useTokenData"
import { GuildPlatform, RolePlatform } from "types"
import useTokenClaimedAmount from "./useTokenClaimedAmount"

const calcRequirementAmount = (
  requirement: any,
  dynamicAmount: any,
  addresses: `0x${string}`[]
) => {
  let leaderboardValue = 0
  try {
    leaderboardValue = requirement.data.snapshot
      .filter((entry) => addresses.includes(entry.key.toLowerCase()))
      .reduce((acc, entry) => acc + entry.value, 0)
  } catch {
    leaderboardValue = 0
  }
  if (!leaderboardValue) return 0

  return Number(
    (
      (leaderboardValue * dynamicAmount?.operation?.params.multiplier +
        dynamicAmount?.operation?.params.addition) as number
    ).toFixed(6)
  )
}

const useClaimableTokensForRolePlatform = (rolePlatform: RolePlatform) => {
  const { addresses } = useUser()

  const dynamicAmount = rolePlatform.dynamicAmount

  const { chain, poolId, tokenAddress } =
    rolePlatform.guildPlatform.platformGuildData

  const {
    data: { decimals },
  } = useTokenData(chain, tokenAddress)

  const { data: alreadyClaimed } = useTokenClaimedAmount(
    chain,
    poolId,
    [rolePlatform.id],
    decimals
  )

  const { data: requirements } = useRequirements(
    dynamicAmount?.operation?.input?.[0]?.roleId
  )
  const req = requirements?.find(
    (r) => r.id === dynamicAmount?.operation?.input?.[0]?.requirementId
  )

  const rewardType = dynamicAmount?.operation?.input?.[0]?.type

  const getSum = () => {
    switch (rewardType) {
      case "STATIC":
        return dynamicAmount.operation.input[0].value
      case "REQUIREMENT_AMOUNT":
        return calcRequirementAmount(
          req,
          dynamicAmount,
          addresses?.map((addr) => addr.address) || []
        )
      case "REQUIREMENT_ACCESS":
        return 0
      default:
        return 0
    }
  }

  return getSum() - (alreadyClaimed?.[0] || 0)
}

const useClaimableTokens = (guildPlatform: GuildPlatform) => {
  const { addresses } = useUser()
  const { roles } = useGuild()

  const getRequirement = (roleId: number, requirementId: number) => {
    const role: any = roles.find((r) => r.id === roleId)
    return role?.requirements?.find((req) => req.id === requirementId) || null
  }

  const calculateFromDynamicAmount = (dynamicAmount: any) => {
    const rewardType = dynamicAmount?.operation?.input?.[0]?.type
    const roleId = dynamicAmount?.operation?.input?.[0]?.roleId
    const requirementId = dynamicAmount?.operation?.input?.[0]?.requirementId
    const req = getRequirement(roleId, requirementId)

    switch (rewardType) {
      case "STATIC":
        return dynamicAmount.operation.input[0].value
      case "REQUIREMENT_AMOUNT":
        return calcRequirementAmount(
          req,
          dynamicAmount,
          addresses?.map((addr) => addr.address) || []
        )
      case "REQUIREMENT_ACCESS":
        // TODO
        return 0
      default:
        return 0
    }
  }

  const { roleIds } = useMembership()

  const getRolePlatforms = () =>
    roles
      ?.flatMap((role) => role.rolePlatforms)
      ?.filter(
        (rp) =>
          rp?.guildPlatformId === guildPlatform.id ||
          rp?.guildPlatform?.id === guildPlatform.id
      )
      .filter((rp) => roleIds?.includes(rp.roleId) || false)

  const {
    data: { decimals },
  } = useTokenData(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.tokenAddress
  )

  const { data: alreadyClaimedAmounts } = useTokenClaimedAmount(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.poolId,
    getRolePlatforms().map((rp) => rp.id),
    decimals
  )

  const getValue = () => {
    const rolePlatforms = getRolePlatforms()

    const sum = rolePlatforms.reduce(
      (acc, rolePlatform) =>
        acc + calculateFromDynamicAmount(rolePlatform.dynamicAmount),
      0
    )

    const alreadyClaimed =
      alreadyClaimedAmounts?.reduce((acc, amount) => acc + amount) || 0

    return sum - alreadyClaimed
  }

  return getValue()
}

export { useClaimableTokens, useClaimableTokensForRolePlatform }
