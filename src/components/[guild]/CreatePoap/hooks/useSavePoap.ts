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

const useSavePoap = ({ onSuccess }: UseSubmitOptions = {}) => {
  const { mutateGuild, id } = useGuild()
  const showErrorToast = useShowErrorToast()

  const fetchData = async (signedValidation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/poaps`, signedValidation)

  return useSubmitWithSign<any>(fetchData, {
    onError: (error) => showErrorToast(error),
    onSuccess: (newPoap) => {
      // Mutating guild data, so the new POAP shows up in the POAPs list
      mutateGuild(
        (oldData) => ({
          ...oldData,
          poaps: [...oldData.poaps, newPoap],
        }),
        { revalidate: false }
      )
      onSuccess?.()
    },
  })
}

export default useSavePoap
