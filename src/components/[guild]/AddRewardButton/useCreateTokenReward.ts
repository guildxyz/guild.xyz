import { Schemas } from "@guildxyz/types"
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
  const { onSubmit: onRequirementSubmit, isLoading: creatingRequirement } =
    useCreateRequirementForRole()
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const { id: guildId } = useGuild()

  const { onSubmit: onAddRewardSubmit, isLoading: creatingReward } = useAddReward({
    onSuccess: () => {
      onSuccess()
    },
    onError: (err) => {
      onError(err)
    },
  })

  const { onSubmit: onCreateRoleSubmit, isLoading: creatingRole } = useCreateRole({})

  const addToExistingRole = async (data: CreateData, saveAs: "DRAFT" | "PUBLIC") => {
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
         * Now the reward can be added, as we now have the requirementId that is
         * needed in the reward's rolePlatform's dynamicData field.
         */
        // We don't use "SUM" yet, so we can early return here in order to have proper types
        if (data.rolePlatforms[0].dynamicAmount.operation.type !== "SUM") return

        const modifiedData = { ...data }
        const tokenGuildPlatformExists = !!data.rolePlatforms[0].guildPlatformId

        // Setting dynamic amount fields
        if (
          isRequirementAmountOrAccess(
            modifiedData.rolePlatforms[0].dynamicAmount.operation.input
          )
        ) {
          modifiedData.rolePlatforms[0].dynamicAmount.operation.input.roleId =
            Number(data.roleIds[0])

          modifiedData.rolePlatforms[0].dynamicAmount.operation.input.requirementId =
            req.id
        }

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

        onAddRewardSubmit(rewardSubmitData).then(() => triggerMembershipUpdate())
      },
      onError: (error) => console.error(error),
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

    const modifiedData = { ...data }
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
    await onAddRewardSubmit(rewardSubmitData)
    triggerMembershipUpdate()
  }

  const submitCreate = (data: CreateData, saveAs: "DRAFT" | "PUBLIC" = "PUBLIC") => {
    const shouldAddToExisting = data?.roleIds.length !== 0
    return shouldAddToExisting
      ? addToExistingRole(data, saveAs)
      : createWithNewRole(data, saveAs)
  }

  return {
    submitCreate,
    isLoading: creatingRequirement || creatingReward || creatingRole,
  }
}

export default useCreateReqBasedTokenReward
