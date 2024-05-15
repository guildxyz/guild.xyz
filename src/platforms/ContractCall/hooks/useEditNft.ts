import useEditGuildPlatform from "components/[guild]/AccessHub/hooks/useEditGuildPlatform"
import useEditRolePlatform from "components/[guild]/AccessHub/hooks/useEditRolePlatform"
import { CreateNftFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/NftDataForm"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useCallback } from "react"

const useEditNft = (guildPlatformId: number, rolePlatformId: number) => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()
  const showSuccessToast = useCallback(
    () =>
      toast({
        status: "success",
        title: "Successfully edited NFT",
      }),
    [toast]
  )

  const editGuildPlatform = useEditGuildPlatform({
    guildPlatformId,
  })

  const editRolePlatform = useEditRolePlatform({
    rolePlatformId,
  })

  const editNftContractCalls = async (data: Partial<CreateNftFormType>) => {
    const { contractData, apiData } = separateContractAndAPIData(data)

    if (Object.keys(contractData).length > 0) {
      // TODO: multicall
      console.log("TODO: multicall")
    }

    // Returning the data which we need to send to our API, so we can use it directly in editGuildPlatform.onSubmit
    return apiData
  }

  const editNft = useSubmit(editNftContractCalls, {
    onSuccess: (apiData) => {
      if (
        !Object.keys(apiData.rolePlatform).length &&
        !Object.keys(apiData.platformGuildData).length
      ) {
        showSuccessToast()
        return
      }

      const apiCalls = []

      if (Object.keys(apiData.rolePlatform).length > 0) {
        console.log("TODO: edit rolePlatform")
        // apiCalls.push(editRolePlatform.onSubmit(apiData.rolePlatform))
      }

      if (Object.keys(apiData.platformGuildData).length > 0) {
        console.log("TODO: edit guildPlatform")
        // apiCalls.push(
        //   editGuildPlatform.onSubmit({
        //     platformGuildData: apiData.platformGuildData,
        //   })
        // )
      }

      // Handling the success/error state here, because we can't really "chain" these calls using our useEditGuildPlatform & useEditRolePlatform hooks
      Promise.all(apiCalls)
        .then(() => showSuccessToast())
        .catch((error) => showErrorToast(error))
    },
    onError: (error) => showErrorToast(error),
  })

  return {
    onSubmit: editNft.onSubmit,
    isLoading: editNft.isLoading || editGuildPlatform.isLoading,
  }
}

const NFT_PLATFORM_GUILD_DATA_KEYS = [
  "richTextDescription",
] as const satisfies (keyof CreateNftFormType)[]
const NFT_ROLE_PLATFORM_KEYS = [
  "startTime",
  "endTime",
] as const satisfies (keyof CreateNftFormType)[]
type PlatformGuildDataKeys = (typeof NFT_PLATFORM_GUILD_DATA_KEYS)[number]
type RolePlatformKeys = (typeof NFT_ROLE_PLATFORM_KEYS)[number]

const separateContractAndAPIData = (data: Partial<CreateNftFormType>) => {
  const apiData: {
    platformGuildData: Partial<Pick<CreateNftFormType, PlatformGuildDataKeys>>
    rolePlatform: Partial<Pick<CreateNftFormType, RolePlatformKeys>>
  } = { platformGuildData: {}, rolePlatform: {} }

  const contractData: Partial<
    Omit<CreateNftFormType, PlatformGuildDataKeys & RolePlatformKeys>
  > = {}

  for (const key of Object.keys(data)) {
    if (NFT_PLATFORM_GUILD_DATA_KEYS.includes(key as PlatformGuildDataKeys)) {
      const keyToSet = key === "richTextDescription" ? "description" : key
      apiData.platformGuildData[keyToSet] = data[key]
    } else if (NFT_ROLE_PLATFORM_KEYS.includes(key as RolePlatformKeys)) {
      apiData.rolePlatform[key] = data[key]
    } else {
      contractData[key] = data[key]
    }
  }

  return { apiData, contractData }
}

export default useEditNft
