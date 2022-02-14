import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import { Guild, Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

const useEdit = (onClose?: () => void) => {
  const guild = useGuild()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = (data_: Guild | Role) =>
    fetcher(`/guild/${guild?.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          ...data_,
          // Mapping requirements in order to properly send "interval-like" NFT attribute values to the API
          requirements: (data_ as Role)?.requirements
            ? preprocessRequirements((data_ as Role).requirements)
            : undefined,
        },
        replacer
      ),
    })

  const { onSubmit, response, error, isLoading } = useSubmitWithSign<Guild, any>(
    submit,
    {
      onSuccess: () => {
        toast({
          title: `Guild successfully updated!`,
          status: "success",
        })
        if (onClose) onClose()
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

export default useEdit
