import useGuild from "components/[guild]/hooks/useGuild"
import useIsV2 from "hooks/useIsV2"
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

  const isV2 = useIsV2()

  const submit = (signedValidation: SignedValdation) =>
    fetcher(isV2 ? `/v2/guilds/${id}` : `/guild/${id}`, {
      method: isV2 ? "PUT" : "PATCH",
      ...signedValidation,
    })

  const useSubmitResponse = useSubmitWithSign<any>(submit, {
    forcePrompt: true,
    onSuccess: (newGuild) => {
      if (onSuccess) onSuccess()
      if (isV2) {
        guild.mutateGuild((prev) => ({ ...prev, ...newGuild }), {
          revalidate: false,
        })
      } else {
        guild.mutateGuild()
      }

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
