import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"

const useNewOwner = ({ onSuccess }) => {
  const { id } = useGuild()
  const submit = async (signedValidation: SignedValdation) =>
    fetcher(`/guild/${id}/ownership`, {
      method: "PUT",
      ...signedValidation,
    })
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<any>(submit, {
    forcePrompt: true,
    onSuccess: (res) => {
      if (onSuccess) onSuccess(res)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useNewOwner
