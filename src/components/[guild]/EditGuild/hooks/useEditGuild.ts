import useGuild from "components/[guild]/hooks/useGuild"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { useRouter } from "next/router"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"

type Props = {
  onSuccess?: () => void
  guildId?: string | number
}

const useEditGuild = ({ onSuccess, guildId }: Props = {}) => {
  const guild = useGuild(guildId)

  const matchMutate = useMatchMutate()

  const showErrorToast = useShowErrorToast()
  const router = useRouter()

  const id = guildId ?? guild?.id

  const submit = (signedValidation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}`, {
      method: "PUT",
      ...signedValidation,
    })

  const useSubmitResponse = useSubmitWithSign<any>(submit, {
    forcePrompt: true,
    onSuccess: (newGuild) => {
      if (onSuccess) onSuccess()
      guild.mutateGuild()

      matchMutate(/^\/guild\/address\//)
      matchMutate(/^\/guild\?order/)
      if (newGuild?.urlName && newGuild.urlName !== guild?.urlName) {
        router.push(newGuild.urlName)
      }
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
