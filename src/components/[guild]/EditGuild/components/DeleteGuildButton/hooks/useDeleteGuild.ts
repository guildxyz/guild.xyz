import useGuild from "components/[guild]/hooks/useGuild"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useIsV2 from "hooks/useIsV2"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useFormContext } from "react-hook-form"
import fetcher from "utils/fetcher"

type Data = {
  removePlatformAccess?: boolean
}

const useDeleteGuild = () => {
  const { reset } = useFormContext()
  const matchMutate = useMatchMutate()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()
  const { mutate: mutateYourGuilds } = useYourGuilds()

  const guild = useGuild()

  const isV2 = useIsV2()

  const submit = async (signedValidation: SignedValdation) =>
    fetcher(isV2 ? `/v2/guilds/${guild.id}` : `/guild/${guild.id}`, {
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

      if (isV2) {
        mutateYourGuilds(
          (prev) => prev?.filter((yourGuild) => yourGuild.id !== guild.id) ?? []
        )
      } else {
        matchMutate(/^\/guild\/address\//)
        matchMutate(/^\/guild\?order/)
      }

      reset()

      router.push("/explorer")
    },
    onError: (error) => showErrorToast(error),
    forcePrompt: true,
  })
}

export default useDeleteGuild
