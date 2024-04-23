import { useCreateRequirementForRole } from "components/create-guild/Requirements/hooks/useCreateRequirement"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useShowErrorToast from "hooks/useShowErrorToast"
import { PlatformType, Requirement, RolePlatform, Visibility } from "types"
import getRandomInt from "utils/getRandomInt"
import useGuild from "../hooks/useGuild"
import useAddReward from "./hooks/useAddReward"

type CreateData = {
  rolePlatforms: RolePlatform[]
  roleIds?: number[]
  requirements: Requirement[]
  name?: string
}

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
  const { onSubmit: onRequirementSubmit } = useCreateRequirementForRole()

  const { id: guildId } = useGuild()

  const { onSubmit: onAddRewardSubmit } = useAddReward({
    onSuccess: () => {
      onSuccess()
    },
    onError: (err) => {
      onError(err)
    },
  })

  const { onSubmit: onCreateRoleSubmit } = useCreateRole({})

  const getRewardSubmitData = (
    data: any,
    saveAs: "DRAFT" | "PUBLIC" = "PUBLIC",
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

  const addToExistingRole = async (
    data: CreateData,
    saveAs: "DRAFT" | "PUBLIC" = "PUBLIC"
  ) => {
    if (data.roleIds.length > 1) {
      showErrorToast("Dynamic token rewards can be added to only one role at most.")
      return
    }
    if (data.requirements.length > 1) {
      showErrorToast(
        "You cannot set requirements to the role when adding this reward."
      )
      return
    }

    await onRequirementSubmit({
      requirement: data.requirements[0],
      roleId: data.roleIds[0],
      onSuccess: (req) => {
        /**
         * Now the reward can be added, as we now have the requirementId that
         * is needed in the reward's rolePlatform's dynamicData field.
         */

        const modifiedData: any = { ...data }
        const tokenGuildPlatformExists = !!data.rolePlatforms[0].guildPlatformId

        // Setting dynamic amount fields
        modifiedData.rolePlatforms[0].dynamicAmount.operation.input.roleId = Number(
          data.roleIds[0]
        )
        modifiedData.rolePlatforms[0].dynamicAmount.operation.input.requirementId =
          req.id

        if (tokenGuildPlatformExists) {
          // Removing guild platform data, as we add to an already existing one
          modifiedData.rolePlatforms[0].guildPlatform = {
            platformId: PlatformType.ERC20,
            platformName: "ERC20",
            platformGuildId: "",
            platformGuildData: {},
          }
        }

        const rewardSubmitData = getRewardSubmitData(
          modifiedData,
          saveAs,
          data.roleIds[0]
        )
        onAddRewardSubmit(rewardSubmitData)
      },
      onError: (error) => console.log(error),
    })
  }

  const createWithNewRole = async (
    data: CreateData,
    saveAs: "DRAFT" | "PUBLIC" = "PUBLIC"
  ) => {
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
    modifiedData.rolePlatforms[0].dynamicAmount.operation.input.roleId = Number(
      createdRole.id
    )
    modifiedData.rolePlatforms[0].dynamicAmount.operation.input.requirementId =
      createdRole.requirements[0].id

    const rewardSubmitData = getRewardSubmitData(
      modifiedData,
      saveAs,
      createdRole.id
    )
    await onAddRewardSubmit(rewardSubmitData)
  }

  const submitCreate = (data: CreateData, saveAs: "DRAFT" | "PUBLIC" = "PUBLIC") => {
    const shouldAddToExisting = data?.roleIds.length !== 0
    return shouldAddToExisting
      ? addToExistingRole(data, saveAs)
      : createWithNewRole(data, saveAs)
  }

  return { submitCreate }
}

export default useCreateReqBasedTokenReward
