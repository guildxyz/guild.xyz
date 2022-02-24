import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import { Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

const useEditRole = (roleId: number, onSuccess?: () => void) => {
  const guild = useGuild()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = (data_: Role) =>
    fetcher(`/role/${roleId}`, {
      method: "PATCH",
      body: {
        ...data_,
        // Mapping requirements in order to properly send "interval-like" NFT attribute values to the API
        requirements: data_?.requirements
          ? preprocessRequirements(data_.requirements)
          : undefined,
      },
      replacer,
    })

  const { onSubmit, response, error, isLoading } = useSubmitWithSign<Role, any>(
    submit,
    {
      onSuccess: () => {
        toast({
          title: `Role successfully updated!`,
          status: "success",
        })
        if (onSuccess) onSuccess()
        mutate(`/guild/urlName/${guild?.urlName}`)
      },
      onError: (err) => showErrorToast(err),
    }
  )

  return {
    onSubmit,
    error,
    isLoading,
    response,
  }
}

export default useEditRole
