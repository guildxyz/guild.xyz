import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"

const useEditGuild = (onSuccess?: () => void) => {
  const guild = useGuild()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = (data_: Guild) =>
    fetcher(`/guild/${guild?.id}`, {
      method: "PATCH",
      body: data_,
      replacer,
    })

  const { onSubmit, response, error, isLoading } = useSubmitWithSign<Guild, any>(
    submit,
    {
      onSuccess: () => {
        toast({
          title: `Guild successfully updated!`,
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

export default useEditGuild
