import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"

type Props = {
  onSuccess?: () => void
}

const useNewOwner = ({ onSuccess }: Props = {}) => {
  const { id } = useGuild()
  const submit = async (signedValidation: SignedValdation) =>
    fetcher(`/guild/${id}/ownership`, {
      method: "PUT",
      ...signedValidation,
    })
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<any>(submit, {
    forcePrompt: true,
    onSuccess: () => {
      if (onSuccess) onSuccess()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useNewOwner
