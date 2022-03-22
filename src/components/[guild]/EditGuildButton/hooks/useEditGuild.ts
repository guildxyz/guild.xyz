import useGuild from "components/[guild]/hooks/useGuild"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"

const useEditGuild = (onSuccess?: () => void) => {
  const guild = useGuild()

  const { mutate } = useSWRConfig()
  const matchMutate = useMatchMutate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = ({ validation, data }: WithValidation<Guild>) =>
    fetcher(`/guild/${guild?.id}`, {
      method: "PATCH",
      validation,
      body: data,
    })

  const useSubmitResponse = useSubmitWithSign<Guild, any>(submit, {
    onSuccess: () => {
      toast({
        title: `Guild successfully updated!`,
        status: "success",
      })
      if (onSuccess) onSuccess()
      mutate([`/guild/${guild?.urlName}`, undefined])

      matchMutate(/^\/guild\/address\//)
      matchMutate(/^\/guild\?order/)
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) =>
      useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer))),
  }
}

export default useEditGuild
