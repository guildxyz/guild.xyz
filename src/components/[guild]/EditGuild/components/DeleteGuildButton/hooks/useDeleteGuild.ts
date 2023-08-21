import { useYourGuilds } from "components/explorer/YourGuilds"
import useGuild from "components/[guild]/hooks/useGuild"
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
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()
  const { mutate: mutateYourGuilds } = useYourGuilds()

  const guild = useGuild()

  const submit = async (signedValidation: SignedValdation) =>
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

      mutateYourGuilds(
        (prev) => prev?.filter((yourGuild) => yourGuild.id !== guild.id) ?? []
      )

      reset()

      router.push("/explorer")
    },
    onError: (error) => showErrorToast(error),
    forcePrompt: true,
  })
}

export default useDeleteGuild
