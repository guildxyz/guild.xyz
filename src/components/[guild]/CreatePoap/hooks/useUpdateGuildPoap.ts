import useGuild from "components/[guild]/hooks/useGuild"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { GuildPoap } from "types"
import fetcher from "utils/fetcher"
import { useCreatePoapContext } from "../components/CreatePoapContext"
import usePoapEventDetails from "../components/Requirements/components/VoiceParticipation/hooks/usePoapEventDetails"

type UpdatePoapData = { id: number; expiryDate?: number; activate?: boolean }

const updateGuildPoap = async (signedValidation: SignedValdation) =>
  fetcher(`/assets/poap`, {
    method: "PATCH",
    ...signedValidation,
  })

const useUpdateGuildPoap = (type: "UPDATE" | "ACTIVATE" = "UPDATE") => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { poaps, mutateGuild } = useGuild()
  const { poapData, setPoapData } = useCreatePoapContext()
  const { poap, mutatePoap } = usePoap(poapData?.fancy_id)
  const guildPoap = poaps?.find((p) => p.poapIdentifier === poapData?.id)
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
      setPoapData(poap)
      toast({
        status: "success",
        title:
          type === "ACTIVATE"
            ? "Successfully activated POAP"
            : "Successfully updated POAP",
      })
    },
  })
}

export default useUpdateGuildPoap
