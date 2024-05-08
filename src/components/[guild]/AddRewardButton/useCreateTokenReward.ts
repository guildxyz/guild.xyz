import { Schemas } from "@guildxyz/types"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useShowErrorToast from "hooks/useShowErrorToast"
import { PlatformType, Requirement, RolePlatform, Visibility } from "types"
import getRandomInt from "utils/getRandomInt"
import useMembershipUpdate from "../JoinModal/hooks/useMembershipUpdate"
import useGuild from "../hooks/useGuild"
import useAddReward from "./hooks/useAddReward"

type CreateData = {
  rolePlatforms: RolePlatform[]
  roleIds?: number[]
  requirements: Requirement[]
  name?: string
}

const isRequirementAmountOrAccess = (
  input: Schemas["DynamicAmount"]["operation"]["input"]
): input is Extract<
  Schemas["DynamicAmount"]["operation"]["input"],
  { type: "REQUIREMENT_AMOUNT" } | { type: "REQUIREMENT_ACCESS" }
> =>
  "type" in input &&
  (input.type === "REQUIREMENT_AMOUNT" || input.type === "REQUIREMENT_ACCESS")

const getRewardSubmitData = (
  data: any,
  saveAs: "DRAFT" | "PUBLIC",
  roleId: number
) => ({
  ...data.rolePlatforms[0].guildPlatform,
  rolePlatforms: [
    {
      ...data.rolePlatforms[0],
      roleId: Number(roleId),
      platformRoleId:
        data.rolePlatforms[0].guildPlatform.platformGuildId ||
        `${roleId}-${Date.now()}`,
      visibility: saveAs === "DRAFT" ? Visibility.HIDDEN : Visibility.PUBLIC,
    },
  ],
})

/**
 * For requirement based rewards, we need to create the requirement first, so that we
 * can reference it in the dynamicAmount fields when creating the role platform.
 */
const useCreateReqBasedTokenReward = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void
  onError: (err) => void
}) => {
  const showErrorToast = useShowErrorToast()
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const { id: guildId, urlName } = useGuild()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = {
    guild: urlName,
    hook: "useCreateReqBasedTokenReward",
  }

  const { onSubmit: onAddRewardSubmit, isLoading: creatingReward } = useAddReward({
    onSuccess: () => {
      captureEvent(
        "createTokenReward(AddToExistingRole) Reward created",
        postHogOptions
      )
      triggerMembershipUpdate()
      onSuccess()
    },
    onError: (err) => {
      captureEvent("createTokenReward(CreateWithNewRole) Failed to create reward", {
        ...postHogOptions,
        err,
      })
      showErrorToast("Failed to create reward")
      onError(err)
    },
  })

  const { onSubmit: onCreateRoleSubmit, isLoading: creatingRole } = useCreateRole({
    onError: (error) => {
      captureEvent("createTokenReward(CreateWithNewRole) Failed to create role", {
        ...postHogOptions,
        error,
      })
      showErrorToast(
        "Failed to create the role for the reward, aborting reward creation."
      )
    },
  })

  const createWithNewRole = async (data: CreateData, saveAs: "DRAFT" | "PUBLIC") => {
    const roleVisibility = saveAs === "DRAFT" ? Visibility.HIDDEN : Visibility.PUBLIC

    const createdRole = await onCreateRoleSubmit({
      ...data,
      name:
        data.name ||
        `${data.rolePlatforms[0].guildPlatform.platformGuildData.name} role`,
      imageUrl:
        data.rolePlatforms[0].guildPlatform.platformGuildData?.imageUrl ||
        `/guildLogos/${getRandomInt(286)}.svg`,
      visibility: roleVisibility,
      rolePlatforms: [],
      logic: "AND",
      guildId,
    })

    if (!createdRole) return
    captureEvent("createTokenReward(CreateWithNewRole) Role created", {
      postHogOptions,
      roleId: createdRole.id,
    })

    const modifiedData: any = { ...data }
    const tokenGuildPlatformExists = !!data.rolePlatforms[0].guildPlatformId

    if (tokenGuildPlatformExists) {
      // Removing guild platform data, as we add to an already existing one
      modifiedData.rolePlatforms[0].guildPlatform = {
        platformId: PlatformType.ERC20,
        platformName: "ERC20",
        platformGuildId: "",
        platformGuildData: {},
      }
    }

    // Setting dynamic amount fields
    if (
      isRequirementAmountOrAccess(
        modifiedData.rolePlatforms[0].dynamicAmount.operation.input
      )
    ) {
      modifiedData.rolePlatforms[0].dynamicAmount.operation.input.roleId = Number(
        createdRole.id
      )
      modifiedData.rolePlatforms[0].dynamicAmount.operation.input.requirementId =
        createdRole.requirements[0].id
    }

    const rewardSubmitData = getRewardSubmitData(
      modifiedData,
      saveAs,
      createdRole.id
    )
    const createdReward = await onAddRewardSubmit(rewardSubmitData)
    if (!createdReward) return
    captureEvent("createTokenReward(CreateWithNewRole) Reward created", {
      postHogOptions,
      guildPlatformId: createdReward.id,
    })

    triggerMembershipUpdate()
  }

  return {
    submitCreate: createWithNewRole,
    isLoading: creatingReward || creatingRole,
  }
}

export default useCreateReqBasedTokenReward
