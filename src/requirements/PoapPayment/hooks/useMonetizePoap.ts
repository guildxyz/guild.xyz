import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type MonetizePoapParams = {
  poapId: number
  vaultId: number
  chainId: number
  contract: string
}

const monetizePoap = (signedValidation: SignedValdation) =>
  fetcher("/assets/poap/monetize", signedValidation)

const useMonetizePoap = (callback?: () => void) => {
  const { mutateGuild } = useGuild()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<any>(monetizePoap, {
    onError: (error) => showErrorToast(error?.message ?? error),
    onSuccess: () => {
      mutateGuild()
      toast({
        title: "Successfully added payment requirement",
        status: "success",
      })
      callback?.()
    },
  })
}

export default useMonetizePoap
