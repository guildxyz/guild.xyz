import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import { GuildPoap } from "types"
import fetcher from "utils/fetcher"
import usePoapEventDetails from "../components/Requirements/components/VoiceParticipation/hooks/usePoapEventDetails"

type UpdatePoapData = { id: number; expiryDate?: number; activate?: boolean }

const updateGuildPoap = async (signedValidation: SignedValdation) =>
  fetcher(`/assets/poap`, {
    method: "PATCH",
    ...signedValidation,
  })

const useUpdateGuildPoap = (guildPoap) => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { mutateGuild } = useGuild()

  const { mutatePoap } = usePoap(guildPoap?.fancy_id)
  const { mutatePoapEventDetails } = usePoapEventDetails()

  return useSubmitWithSign<GuildPoap>(updateGuildPoap, {
    onError: (error) => showErrorToast(error?.error?.message ?? error?.error),
    onSuccess: async (response) => {
      // Mutating guild and POAP data, so the user can see the fresh data in the POAPs list
      const mutatePoapEventDetailsWithResponse = mutatePoapEventDetails({
        ...response,
        contracts: guildPoap?.poapContracts,
      })
      await Promise.all([
        mutateGuild,
        mutatePoap,
        mutatePoapEventDetailsWithResponse,
      ])
      toast({
        status: "success",
        title: "Successfully updated POAP",
      })
    },
  })
}

export default useUpdateGuildPoap
