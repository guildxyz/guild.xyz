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
import useAddRoleRewards from "./useAddRoleRewards"

const isERC20 = (data) =>
  data.rolePlatforms[0].guildPlatform.platformId === PlatformType.ERC20

const useSubmitAddReward = ({
  onSuccess,
}: {
  onSuccess?: (
    res?:
      | ReturnType<typeof useCreateRole>["response"]
      | ReturnType<typeof useAddReward>["response"]
  ) => void
}) => {
  const toast = useToast()
  const { selection, onClose: onAddRewardModalClose } = useAddRewardContext()
  const [, setIsAddRewardPanelDirty] = useAddRewardDiscardAlert()
  const { roles, guildPlatforms } = useGuild()
  const { captureEvent } = usePostHogContext()

  const methods = useFormContext()

  const onCloseAndClear = () => {
    methods.reset(defaultValues)
    onAddRewardModalClose()
    setIsAddRewardPanelDirty(false)
  }

  const { onSubmit: onCreateRoleSubmit, isLoading: isCreateRoleLoading } =
    useCreateRole({
      onSuccess: (res) => {
        toast({ status: "success", title: "Reward successfully added" })
        onSuccess?.(res)
        onCloseAndClear()
      },
    })

  const { submitCreate: submitCreateReqBased, isLoading: erc20Loading } =
    useCreateReqBasedTokenReward({
      onSuccess: (res) => {
        toast({ status: "success", title: "Reward successfully added" })
        onSuccess?.(res)
        onCloseAndClear()
      },
      onError: (err) => console.error(err),
    })

  const { onSubmit: onAddRewardSubmit, isLoading: isAddRewardLoading } =
    useAddReward({
      onSuccess: (res) => {
        captureEvent("[discord setup] successfully added to existing guild")
        onSuccess?.(res)
        onCloseAndClear()
      },
      onError: (err) => {
        captureEvent("[discord setup] failed to add to existing guild", {
          error: err,
        })
      },
    })

  const { onSubmit: onAddRoleRewardSubmit, isLoading: isAddRoleRewardLoading } =
    useAddRoleRewards({
      onSuccess: () => {
        onCloseAndClear()
      },
    })

  const isLoading =
    isAddRewardLoading ||
    isCreateRoleLoading ||
    erc20Loading ||
    isAddRoleRewardLoading

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
    console.log(data)

    if (isERC20(data)) return submitERC20Reward(data, saveAs)

    const existingDCReward = guildPlatforms?.find(
      (gp) =>
        data?.rolePlatforms?.[0]?.guildPlatform?.platformId ===
          PlatformType.DISCORD &&
        data?.rolePlatforms?.[0]?.guildPlatform?.platformId === gp.platformId &&
        data?.rolePlatforms?.[0]?.guildPlatform?.platformGuildId ===
          gp.platformGuildId
    )

    if (existingDCReward && data.rolePlatforms[0]) {
      data.rolePlatforms[0].guildPlatform = existingDCReward
      data.rolePlatforms[0].guildPlatformId = existingDCReward.id

      if (!data.rolePlatforms[0].platformRoleId) {
        // Delete any falsy values
        delete data.rolePlatforms[0].platformRoleId
      }
    }

    if (!data.roleIds || data?.roleIds.length === 0) {
      const roleVisibility =
        saveAs === "DRAFT" ? Visibility.HIDDEN : Visibility.PUBLIC
      onCreateRoleSubmit({
        ...data,
        name: data.roleName || `New ${rewards[selection].name} role`,
        imageUrl: data.imageUrl || `/guildLogos/${getRandomInt(286)}.svg`,
        roleVisibility,
        rolePlatforms: data.rolePlatforms.map((rp) => ({
          ...rp,
          visibility: roleVisibility,
        })),
      })
    } else if (existingDCReward) {
      onAddRoleRewardSubmit({
        roleIds: data?.roleIds ?? [],
        ...data?.rolePlatforms?.[0],
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
