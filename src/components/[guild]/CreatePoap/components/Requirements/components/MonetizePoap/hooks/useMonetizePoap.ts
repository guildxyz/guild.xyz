import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type MonetizePoapParams = {
  poapId: number
  vaultId: number
  chainId: number
  contract: string
}

const monetizePoap = ({
  validation,
  data: body,
}: WithValidation<MonetizePoapParams>) =>
  fetcher("/assets/poap/monetize", {
    validation,
    body,
  })

const useMonetizePoap = (callback?: () => void) => {
  const { mutateGuild } = useGuild()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<MonetizePoapParams, any>(monetizePoap, {
    onError: (error) => showErrorToast(error?.message ?? error),
    onSuccess: () => {
      mutateGuild()
      toast({
        title: "Successfully created vault",
        status: "success",
      })
      callback?.()
    },
  })
}

export default useMonetizePoap
