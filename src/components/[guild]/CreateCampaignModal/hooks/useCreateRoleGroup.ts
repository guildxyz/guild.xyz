import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
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

  const createRoleGroup = (signedValidation: SignedValdation): Promise<Group> =>
    fetcher(`/v2/guilds/${id}/groups`, signedValidation)

  return useSubmitWithSign<Group>(createRoleGroup, {
    onSuccess: (response) => {
      triggerConfetti()
      toast({
        status: "success",
        title: "Successfully created campaign",
      })

      mutateGuild((curr) => ({
        ...curr,
        groups: [...(curr.groups ?? []), response],
      }))

      router.push(`/${urlName}/${response.urlName}`)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useCreateRoleGroup
