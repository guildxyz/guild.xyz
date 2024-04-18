import { TokenAccessHubData } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import { useAccount } from "wagmi"

const calcRequirementAmount = (
  requirement: any,
  dynamicAmount: any,
  address: `0x${string}`
) => {
  let leaderboardValue = 0
  try {
    leaderboardValue =
      requirement.data.snapshot.find(
        (entry) => entry.key.toLowerCase() === address.toLowerCase()
      ).value || null
  } catch {
    leaderboardValue = 0
  }
  if (!leaderboardValue) return 0

  return (
    leaderboardValue * dynamicAmount?.operation?.params.multiplier +
    dynamicAmount?.operation?.params.addition
  )
}

const useCalculateFromDynamic = (dynamicAmount: any) => {
  const { address } = useAccount()

  const { data: requirements } = useRequirements(
    dynamicAmount?.operation?.input?.[0]?.roleId
  )
  const req = requirements?.find(
    (r) => r.id === dynamicAmount?.operation?.input?.[0]?.requirementId
  )

  const rewardType = dynamicAmount?.operation?.input?.[0]?.type

  const getValue = () => {
    switch (rewardType) {
      case "STATIC":
        return dynamicAmount.operation.input[0].value
      case "REQUIREMENT_AMOUNT":
        return calcRequirementAmount(req, dynamicAmount, address)
      case "REQUIREMENT_ACCESS":
        return 0
      default:
        return 0
    }
  }

  return { getValue }
}

const useCalculateClaimableTokens = (
  rolePlatformsByRoles: TokenAccessHubData["rolePlatformsByRoles"]
) => {
  const { address } = useAccount()
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
        return calcRequirementAmount(req, dynamicAmount, address)
      case "REQUIREMENT_ACCESS":
        // TODO
        return 0
      default:
        return 0
    }
  }

  const calcForRole = (
    rolePlatforms: TokenAccessHubData["rolePlatformsByRoles"][0]["rolePlatforms"]
  ) => {
    const sum = rolePlatforms.reduce((acc, rolePlatform) => {
      return acc + calculateFromDynamicAmount(rolePlatform.dynamicAmount)
    }, 0)

    return sum
  }

  const getValue = () => {
    const sum = rolePlatformsByRoles.reduce((acc, rolePlatformByRole) => {
      return acc + calcForRole(rolePlatformByRole.rolePlatforms)
    }, 0)

    return sum
  }

  return { getValue, calcForRole }
}

export { useCalculateClaimableTokens, useCalculateFromDynamic }
