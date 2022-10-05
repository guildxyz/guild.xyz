import useGuild from "components/[guild]/hooks/useGuild"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { GuildPoap } from "types"
import fetcher from "utils/fetcher"
import { useCreatePoapContext } from "../components/CreatePoapContext"

type UpdatePoapData = { id: number; expiryDate: number }

const updateGuildPoap = async ({
  validation,
  data,
}: WithValidation<UpdatePoapData>) =>
  fetcher(`/assets/poap`, {
    method: "PATCH",
    validation,
    body: data,
  })

const useUpdateGuildPoap = () => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { mutateGuild } = useGuild()
  const { poapData, setPoapData } = useCreatePoapContext()
  const { poap, mutatePoap } = usePoap(poapData?.fancy_id)

  return useSubmitWithSign<UpdatePoapData, GuildPoap>(updateGuildPoap, {
    onError: (error) => showErrorToast(error?.error?.message ?? error?.error),
    onSuccess: async () => {
      // Mutating guild and POAP data, so the user can see the fresh data in the POAPs list
      await mutateGuild()
      await mutatePoap()
      setPoapData(poap)
      toast({
        status: "success",
        title: "Successfully updated POAP",
      })
    },
  })
}

export default useUpdateGuildPoap
