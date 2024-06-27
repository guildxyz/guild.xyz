import { DynamicAmount } from "@guildxyz/types"
import { CREATE_NEW_OPTION } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/ExistingPointsTypeSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import { RoleToCreate } from "components/create-guild/hooks/useCreateRole"
import useCreateRRR from "hooks/useCreateRRR"
import useShowErrorToast from "hooks/useShowErrorToast"
import {
  GuildPlatform,
  Logic,
  PlatformGuildData,
  PlatformType,
  RolePlatform,
  Visibility,
} from "types"
import getRandomInt from "utils/getRandomInt"
import { LiquidityIncentiveForm } from "../LiquidityIncentiveSetupModal"

const DEFAULT_NAME = "Liquidity Incentive"

const useCreateLiquidityIncentive = (onSuccess: () => void) => {
  const { id } = useGuild()

  const { onSubmit, isLoading } = useCreateRRR({ onSuccess })

  const showErrorToast = useShowErrorToast()

  const submit = async (data: LiquidityIncentiveForm) => {
    if (!id) {
      showErrorToast("Couldn't fetch Guild Id")
      return
    }

    const uniswapRequirement = createUniswapRequirement(data)
    const pointsReward = createPointsReward(data, id, uniswapRequirement.id)
    const role = createRole(id)

    const dataToSubmit = {
      ...role,
      requirements: [uniswapRequirement],
      rolePlatforms: [pointsReward],
    }

    await onSubmit(dataToSubmit)
  }

  return {
    onSubmit: submit,
    isLoading,
  }
}

const createUniswapRequirement = (
  data: LiquidityIncentiveForm
): RoleToCreate["requirements"][number] & { id: number } => ({
  id: Date.now(),
  type: "UNISWAP_V3_POSITIONS",
  visibility: Visibility.PUBLIC,
  isNegated: false,
  data: data.pool.data,
  chain: data.pool.chain,
})

const createPointsReward = (
  data: LiquidityIncentiveForm,
  guildId: number,
  requirementId: number
): Omit<RolePlatform, "id"> => ({
  ...(data.pointsId !== CREATE_NEW_OPTION && data.pointsId !== null
    ? {
        guildPlatformId: data.pointsId,
        guildPlatform: {
          platformName: "POINTS",
          platformId: PlatformType.POINTS,
          platformGuildId: "",
          platformGuildData: {},
        } satisfies GuildPlatform,
      }
    : {
        guildPlatform: {
          platformName: "POINTS",
          platformId: PlatformType.POINTS,
          platformGuildId: `points-${guildId}-${
            data?.name?.toLowerCase() || "points"
          }`,
          platformGuildData: {
            name: data.name,
            imageUrl: data.imageUrl,
          } satisfies PlatformGuildData["POINTS"],
        } satisfies GuildPlatform,
      }),
  dynamicAmount: {
    operation: {
      type: "LINEAR",
      params: {
        addition: 0,
        multiplier: data.conversion,
        shouldFloorResult: true,
      },
      input: {
        type: "REQUIREMENT_AMOUNT",
        requirementId: requirementId,
        roleId: -1, // will be overwritten by useCreateRRR
      },
    },
  } as any as DynamicAmount,
  platformRoleData: {
    score: 0,
  },
  visibility: Visibility.PUBLIC,
})

const createRole = (
  guildId: number
): Omit<RoleToCreate, "requirements" | "rolePlatforms"> => ({
  guildId: guildId,
  name: DEFAULT_NAME,
  description: "",
  logic: "AND" as Logic,
  imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
  visibility: Visibility.PUBLIC,
  anyOfNum: 1,
})

export default useCreateLiquidityIncentive
