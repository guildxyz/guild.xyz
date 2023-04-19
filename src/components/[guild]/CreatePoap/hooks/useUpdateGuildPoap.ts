import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import { GuildPoap } from "types"
import fetcher from "utils/fetcher"

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

  const { mutateGuild } = useGuild()
  const { mutatePoap } = usePoap(guildPoap?.fancyId)
  const { mutatePoapEventDetails } = usePoapEventDetails()

  return useSubmitWithSign<GuildPoap>(updateGuildPoap, {
    onError: (error) => showErrorToast(error?.error?.message ?? error?.error),
    onSuccess: async (response) => {
      mutatePoapEventDetails({
        ...response,
        contracts: guildPoap?.poapContracts,
      })
      mutateGuild(
        (oldData) => ({
          ...oldData,
          poaps: oldData.poaps.map((poap) =>
            poap.id === response.id ? response : poap
          ),
        }),
        // needed until replication lag is solved
        {
          revalidate: false,
        }
      )
      mutatePoap()
      onSuccess?.()
    },
  })
}

export default useUpdateGuildPoap
