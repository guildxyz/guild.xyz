import useEditGuildPlatform from "components/[guild]/AccessHub/hooks/useEditGuildPlatform"
import { CreateNftFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/NftDataForm"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useCallback } from "react"

const useEditNft = (guildPlatformId: number) => {
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
    onSuccess: showSuccessToast,
  })

  const editNftContractCalls = async (data: Partial<CreateNftFormType>) => {
    const { contractData, apiData } = separateContractAndAPIData(data)

    if (Object.keys(contractData).length > 0) {
      // TODO: multicall
    }

    // Returning the data which we need to send to our API, so we can use it directly in editGuildPlatform.onSubmit
    return apiData
  }

  const editNft = useSubmit(editNftContractCalls, {
    onSuccess: (data) => {
      const { apiData } = separateContractAndAPIData(data)
      if (!Object.keys(apiData).length) {
        showSuccessToast()
        return
      }
      editGuildPlatform.onSubmit(apiData)
    },
    onError: (error) => showErrorToast(error),
  })

  return {
    onSubmit: editNft.onSubmit,
    isLoading: editNft.isLoading || editGuildPlatform.isLoading,
  }
}

const NFT_API_DATA_KEYS = [
  "richTextDescription",
] as const satisfies (keyof CreateNftFormType)[]
type APIDataKeys = (typeof NFT_API_DATA_KEYS)[number]
const separateContractAndAPIData = (data: Partial<CreateNftFormType>) => {
  const apiData: Partial<Pick<CreateNftFormType, APIDataKeys>> = {}
  const contractData: Partial<Omit<CreateNftFormType, APIDataKeys>> = {}

  for (const key of Object.keys(data)) {
    if (NFT_API_DATA_KEYS.includes(key as APIDataKeys)) {
      apiData[key] = data[key]
    } else {
      contractData[key] = data[key]
    }
  }

  return { apiData, contractData }
}

export default useEditNft
