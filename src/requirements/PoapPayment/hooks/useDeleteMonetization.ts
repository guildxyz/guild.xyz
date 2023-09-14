import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useDeleteMonetization = (guildPoapId: number, poapContractId: number) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { mutateGuild, id: guildId } = useGuild()

  const deleteMonetization = async (signedValidation: SignedValdation) =>
    fetcher(
      `/v2/guilds/${guildId}/poaps/${guildPoapId}/monetization-contracts/${poapContractId}`,
      {
        method: "DELETE",
        ...signedValidation,
      }
    )

  return useSubmitWithSign<any>(deleteMonetization, {
    onError: (e) => showErrorToast(e),
    onSuccess: () => {
      mutateGuild()
      toast({
        title: "Successfully deleted monetization",
        status: "success",
      })
    },
  })
}

export default useDeleteMonetization
