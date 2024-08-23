import { useYourGuilds } from "@/hooks/useYourGuilds"
import useGuild from "components/[guild]/hooks/useGuild"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

const useDeleteGuild = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()

  const { mutate: mutateYourGuilds } = useYourGuilds()
  const matchMutate = useMatchMutate()

  const guild = useGuild()

  const submit = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${guild.id}`, {
      method: "DELETE",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(submit, {
    onSuccess: () => {
      toast({
        title: `Guild deleted!`,
        description: "You're being redirected to the home page",
        status: "success",
      })

      mutateYourGuilds((prev) => mutateGuildsCache(prev, guild.id), {
        revalidate: false,
      })
      matchMutate<GuildBase[]>(
        /\/guilds\?order/,
        (prev) => mutateGuildsCache(prev, guild.id),
        { revalidate: false }
      )

      router.push("/explorer")
    },
    onError: (error) => showErrorToast(error),
    forcePrompt: true,
  })
}

const mutateGuildsCache = (prev: GuildBase[], deletedGuildId: number) =>
  prev?.filter((guild) => guild.id !== deletedGuildId)

export default useDeleteGuild
