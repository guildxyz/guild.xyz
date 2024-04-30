import { usePostHogContext } from "components/_app/PostHogProvider"
import { useCreateRequirementForRole } from "components/create-guild/Requirements/hooks/useCreateRequirement"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
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
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const { id: guildId, urlName } = useGuild()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = {
    guild: urlName,
    hook: "useCreateReqBasedTokenReward",
  }

  const { onSubmit: onAddRewardSubmit } = useAddReward({
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

  const { onSubmit: onCreateRoleSubmit } = useCreateRole({
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

  const addToExistingRole = async (data: CreateData, saveAs: "DRAFT" | "PUBLIC") => {
    if (data.roleIds.length > 1) {
      captureEvent("Failed to add token reward", {
        ...postHogOptions,
        reason: "Multiple roles selected",
      })
      showErrorToast("Dynamic token rewards can be added to only one role at most.")
      return
    }
    if (data.requirements.length > 1) {
      captureEvent("Failed to add token reward", {
        ...postHogOptions,
        reason: "Multiple requirements set when adding to existing role",
      })
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
         * Now the reward can be added, as we now have the requirementId that is
         * needed in the reward's rolePlatform's dynamicData field.
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

        mutateOptionalAuthSWRKey<Requirement[]>(
          `/v2/guilds/${guildId}/roles/${req.roleId}/requirements`,
          (prevRequirements) => [
            ...prevRequirements.filter((r) => r.type === "FREE"),
            req,
          ],
          { revalidate: false }
        )

        onAddRewardSubmit(rewardSubmitData)
      },
      onError: (error) => {
        captureEvent(
          "createTokenReward(AddToExistingRole) Failed to create requirement",
          { ...postHogOptions, error }
        )
        showErrorToast(
          "Failed to create the snapshot requirement, aborting reward creation."
        )
      },
    })
  }

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
    const createdReward = await onAddRewardSubmit(rewardSubmitData)
    if (!createdReward) return
    captureEvent("createTokenReward(CreateWithNewRole) Reward created", {
      postHogOptions,
      guildPlatformId: createdReward.id,
    })

    triggerMembershipUpdate()
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
