import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type SavePoapType = {
  fancyId: string
  poapId: number
  expiryDate: number
  guildId: number
}

const fetchData = async (signedValidation: SignedValdation) =>
  fetcher("/assets/poap", signedValidation)

const useSavePoap = () => {
  const { mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()

  return useSubmitWithSign<any>(fetchData, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      // Mutating guild data, so the new POAP shows up in the POAPs list
      mutateGuild()
      triggerConfetti()
      toast({
        title: "Successful POAP creation!",
        status: "success",
      })
    },
  })
}

export default useSavePoap
