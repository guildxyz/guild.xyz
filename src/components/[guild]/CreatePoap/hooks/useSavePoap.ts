import useGuild from "components/[guild]/hooks/useGuild"
import useIsV2 from "hooks/useIsV2"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import fetcher from "utils/fetcher"

const useSavePoap = ({ onSuccess }: UseSubmitOptions = {}) => {
  const { mutateGuild, id } = useGuild()
  const showErrorToast = useShowErrorToast()
  const isV2 = useIsV2()

  const fetchData = async (signedValidation: SignedValdation) =>
    fetcher(isV2 ? `/v2/guilds/${id}/poaps` : "/assets/poap", signedValidation)

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
