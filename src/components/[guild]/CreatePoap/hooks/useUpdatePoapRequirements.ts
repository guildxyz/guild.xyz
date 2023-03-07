import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { GuildPoap } from "types"
import fetcher from "utils/fetcher"
import preprocessRequirements from "utils/preprocessRequirements"

const useUpdatePoapRequirements = (
  guildPoap: GuildPoap,
  { onSuccess }: UseSubmitOptions
) => {
  const showErrorToast = useShowErrorToast()

  const { mutateGuild } = useGuild()

  const updatePoapRequirements = async (signedValidation: SignedValdation) =>
    fetcher(`/assets/poap/requirements/${guildPoap?.id}`, {
      method: "PATCH",
      ...signedValidation,
    })

  const { onSubmit, ...rest } = useSubmitWithSign<GuildPoap>(
    updatePoapRequirements,
    {
      onError: (error) => showErrorToast(error),
      onSuccess: async () => {
        mutateGuild()

        onSuccess?.()
      },
    }
  )

  return {
    ...rest,
    onSubmit: (data) => {
      data.requirements = preprocessRequirements(data?.requirements)
      return onSubmit(data)
    },
  }
}

export default useUpdatePoapRequirements
