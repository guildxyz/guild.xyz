import replacer from "components/common/utils/guildJsonReplacer"
import useJsConfetti from "hooks/useJsConfetti"
import usePersonalSign from "hooks/usePersonalSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useFormContext } from "react-hook-form"
import { useSWRConfig } from "swr"
import { Guild } from "temporaryData/types"

const useCreate = (type: "group" | "guild") => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const { setError } = useFormContext()
  const showErrorToast = useShowErrorToast(setError)
  const triggerConfetti = useJsConfetti()
  const router = useRouter()
  const { addressSignedMessage } = usePersonalSign()

  const fetchData = (data: Guild): Promise<Guild> =>
    fetch(`${process.env.NEXT_PUBLIC_API}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        { ...data, addressSignedMessage },
        type === "guild" ? replacer : undefined
      ),
    }).then(async (response) =>
      response.ok ? response.json() : Promise.reject(await response.json?.())
    )

  return useSubmit<Guild, Guild>(fetchData, {
    onError: (error) => showErrorToast(error),
    onSuccess: (response) => {
      triggerConfetti()
      toast({
        title: `${type === "group" ? "Hall" : "Guild"} successfully created!`,
        description: "You're being redirected to it's page",
        status: "success",
      })
      // refetch groups to include the new one on the home page
      mutate(type === "group" ? "groups" : "guilds")
      router.push(`${type === "group" ? "/" : "/guild/"}${response.urlName}`)
    },
  })
}

export default useCreate
