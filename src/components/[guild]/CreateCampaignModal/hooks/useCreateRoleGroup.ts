import useGuild from "components/[guild]/hooks/useGuild"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { Group } from "types"
import fetcher from "utils/fetcher"

const useCreateRoleGroup = () => {
  const router = useRouter()

  const { id, urlName, mutateGuild } = useGuild()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const triggerConfetti = useJsConfetti()

  const createRoleGroup = (signedValidation: SignedValidation): Promise<Group> =>
    fetcher(`/v2/guilds/${id}/groups`, signedValidation)

  return useSubmitWithSign<Group>(createRoleGroup, {
    onSuccess: (response) => {
      triggerConfetti()
      toast({
        status: "success",
        title: "Successfully created page",
      })

      mutateGuild(
        (curr) => ({
          ...curr,
          groups: [...(curr.groups ?? []), response],
        }),
        { revalidate: false }
      )

      router.push(`/${urlName}/${response.urlName}`)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useCreateRoleGroup
