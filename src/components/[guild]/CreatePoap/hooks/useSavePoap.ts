import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import fetcher from "utils/fetcher"

type SavePoapType = {
  fancyId: string
  poapId: number
  expiryDate: number
  guildId: number
}

const fetchData = async (signedValidation: SignedValdation) =>
  fetcher("/assets/poap", signedValidation)

const useSavePoap = ({ onSuccess }: UseSubmitOptions = {}) => {
  const { mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign<any>(fetchData, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      // Mutating guild data, so the new POAP shows up in the POAPs list
      mutateGuild()
      onSuccess?.()
    },
  })
}

export default useSavePoap
