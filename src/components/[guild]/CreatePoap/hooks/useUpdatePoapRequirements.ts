import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { GuildPoap } from "types"
import fetcher from "utils/fetcher"
import preprocessRequirements from "utils/preprocessRequirements"

const useUpdatePoapRequirements = (
  guildPoap: GuildPoap,
  { onSuccess }: UseSubmitOptions
) => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { mutateGuild } = useGuild()

  const updateGuildPoap = async (signedValidation: SignedValdation) =>
    fetcher(`/assets/poap/requirements/${guildPoap?.id}`, {
      method: "PATCH",
      ...signedValidation,
    })

  const { onSubmit, ...rest } = useSubmitWithSign<GuildPoap>(updateGuildPoap, {
    onError: (error) => showErrorToast(error?.error?.message ?? error?.error),
    onSuccess: async (response) => {
      mutateGuild()

      toast({
        status: "success",
        title: "Successfully updated POAP",
      })

      onSuccess?.()
    },
  })

  return {
    ...rest,
    onSubmit: (data) => {
      data.requirements = preprocessRequirements(data?.requirements)
      data.logic = "AND"
      return onSubmit(data)
    },
  }
}

export default useUpdatePoapRequirements
