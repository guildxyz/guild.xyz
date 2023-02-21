import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import { GuildPoap } from "types"
import fetcher from "utils/fetcher"

type UpdatePoapData = { id: number; expiryDate?: number; activate?: boolean }

const updateGuildPoap = async (signedValidation: SignedValdation) =>
  fetcher(`/assets/poap`, {
    method: "PATCH",
    ...signedValidation,
  })

const useUpdateGuildPoap = (
  guildPoap: GuildPoap,
  { onSuccess }: UseSubmitOptions = {}
) => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { mutateGuild } = useGuild()

  const { mutatePoap } = usePoap(guildPoap?.fancyId)
  const { mutatePoapEventDetails } = usePoapEventDetails()

  return useSubmitWithSign<GuildPoap>(updateGuildPoap, {
    onError: (error) => showErrorToast(error?.error?.message ?? error?.error),
    onSuccess: async (response) => {
      // Mutating guild and POAP data, so the user can see the fresh data in the POAPs list
      mutatePoapEventDetails({
        ...response,
        contracts: guildPoap?.poapContracts,
      })
      mutateGuild()
      mutatePoap()

      toast({
        status: "success",
        title: "Successfully updated POAP",
      })
      onSuccess?.()
    },
  })
}

export default useUpdateGuildPoap
