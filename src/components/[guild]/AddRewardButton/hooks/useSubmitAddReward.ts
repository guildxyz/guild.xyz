import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useToast from "hooks/useToast"
import rewards from "platforms/rewards"
import { useFormContext } from "react-hook-form"
import { PlatformType, Visibility } from "types"
import getRandomInt from "utils/getRandomInt"
import { defaultValues } from "../AddRewardButton"
import useCreateReqBasedTokenReward from "../useCreateTokenReward"
import useAddReward from "./useAddReward"
import { useAddRewardDiscardAlert } from "./useAddRewardDiscardAlert"

const isERC20 = (data) =>
  data.rolePlatforms[0].guildPlatform.platformId === PlatformType.ERC20

const useSubmitAddReward = () => {
  const toast = useToast()
  const { selection, onClose: onAddRewardModalClose } = useAddRewardContext()
  const [, setIsAddRewardPanelDirty] = useAddRewardDiscardAlert()
  const { roles } = useGuild()
  const { captureEvent } = usePostHogContext()

  const methods = useFormContext()

  const onCloseAndClear = () => {
    methods.reset(defaultValues)
    onAddRewardModalClose()
    setIsAddRewardPanelDirty(false)
  }

  const { onSubmit: onCreateRoleSubmit, isLoading: isCreateRoleLoading } =
    useCreateRole({
      onSuccess: () => {
        toast({ status: "success", title: "Reward successfully added" })
        onCloseAndClear()
      },
    })

  const { submitCreate: submitCreateReqBased, isLoading: erc20Loading } =
    useCreateReqBasedTokenReward({
      onSuccess: () => {
        toast({ status: "success", title: "Reward successfully added" })
        onCloseAndClear()
      },
      onError: (err) => console.error(err),
    })

  const { onSubmit: onAddRewardSubmit, isLoading: isAddRewardLoading } =
    useAddReward({
      onSuccess: () => {
        captureEvent("[discord setup] successfully added to existing guild")
        onCloseAndClear()
      },
      onError: (err) => {
        captureEvent("[discord setup] failed to add to existing guild", {
          error: err,
        })
      },
    })

  const isLoading = isAddRewardLoading || isCreateRoleLoading || erc20Loading

  const submitERC20Reward = async (
    data: any,
    saveAs: "DRAFT" | "PUBLIC" = "PUBLIC"
  ) => {
    const isRequirementBased =
      data.rolePlatforms[0].dynamicAmount.operation.input.type ===
      "REQUIREMENT_AMOUNT"

    const guildPlatformExists = !!data.rolePlatforms[0].guildPlatformId

    if (isRequirementBased) {
      submitCreateReqBased(data, saveAs)
      return
    } else {
      /** TODO: Write when static reward is needed */
      if (guildPlatformExists) {
        data.rolePlatforms[0].guildPlatform = {
          platformId: PlatformType.ERC20,
          platformName: "ERC20",
          platformGuildId: "",
          platformGuildData: {},
        }
      }
      return
    }
  }

  const onSubmit = async (data: any, saveAs: "DRAFT" | "PUBLIC" = "PUBLIC") => {
    if (isERC20(data)) return submitERC20Reward(data, saveAs)

    if (data.requirements?.length > 0) {
      const roleVisibility =
        saveAs === "DRAFT" ? Visibility.HIDDEN : Visibility.PUBLIC
      onCreateRoleSubmit({
        ...data,
        name: data.name || `New ${rewards[selection].name} role`,
        imageUrl: data.imageUrl || `/guildLogos/${getRandomInt(286)}.svg`,
        roleVisibility,
        rolePlatforms: data.rolePlatforms.map((rp) => ({
          ...rp,
          visibility: roleVisibility,
        })),
      })
    } else {
      onAddRewardSubmit({
        ...data.rolePlatforms[0].guildPlatform,
        rolePlatforms: data.roleIds
          ?.filter((roleId) => !!roleId)
          .map((roleId) => ({
            // We'll be able to send additional params here, like capacity & time
            roleId: +roleId,
            /**
             * Temporary for POINTS rewards, because they can be added to multiple
             * roles and this field has a unique constraint in the DB
             */
            platformRoleId: roleId,
            ...data.rolePlatforms[0],
            visibility:
              saveAs === "DRAFT"
                ? Visibility.HIDDEN
                : roles.find((role) => role.id === +roleId).visibility,
          })),
      })
    }
  }

  return { onSubmit, isLoading }
}

export default useSubmitAddReward
