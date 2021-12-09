import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"
import fetcher from "utils/fetcher"

type Data = {
  deleteFromDiscord?: boolean
}

const useDelete = () => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()

  const guild = useGuild()

  const submit = async (data: Data) =>
    // Deciding if we should edit role or guild by the URL params - later we'll probably need a separated hook for deleting a role
    fetcher(
      router.query.role
        ? `/role/${parseInt(router.query.role.toString())}`
        : `/guild/${guild.id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    )

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `${router.query.role ? "Role" : "Guild"} deleted!`,
        description: router.query.role
          ? "You're being redirected to the Guild's page"
          : "You're being redirected to the home page",
        status: "success",
      })

      if (router.query.role) {
        mutate(`/guild/urlName/${guild?.urlName}`)
      } else {
        mutate("/guild?sort=members")
        router.push("/")
      }
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useDelete
