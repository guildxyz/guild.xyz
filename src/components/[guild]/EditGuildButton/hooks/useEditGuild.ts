import useGuild from "components/[guild]/hooks/useGuild"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"

type Props = {
  onSuccess?: () => void
  guildId?: string | number
}

const useEditGuild = ({ onSuccess, guildId }: Props = {}) => {
  const guild = useGuild(guildId)

  const { mutate } = useSWRConfig()
  const matchMutate = useMatchMutate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()

  const id = guildId ?? guild?.id

  const submit = ({ validation, data }: WithValidation<Guild>) =>
    fetcher(`/guild/${id}`, {
      method: "PATCH",
      validation,
      body: data,
    })

  const useSubmitResponse = useSubmitWithSign<Guild, any>(submit, {
    onSuccess: (newGuild) => {
      toast({
        title: `Guild successfully updated!`,
        status: "success",
      })
      if (onSuccess) onSuccess()
      mutate([`/guild/${guild?.urlName}`, undefined])

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
    onSubmit: (data) => {
      if (
        !!data.isGuarded &&
        !guild.roles.some((role) =>
          role.requirements.some((requirement) => requirement.type === "FREE")
        )
      ) {
        data.roles = [
          {
            guildId: guild.id,
            ...(guild.platforms?.[0]
              ? {
                  platform: guild.platforms[0].type,
                  platformId: guild.platforms[0].platformId,
                }
              : {}),
            name: "Verified",
            description: "",
            logic: "AND",
            requirements: [{ type: "FREE" }],
            imageUrl: "/guildLogos/0.svg",
          },
        ]
      }
      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useEditGuild
