import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { Poap } from "types"
import fetcher from "utils/fetcher"

type ClaimPoapBody = {
  poapId: number
  userId: number
}

const fetchClaim = async (body: ClaimPoapBody) =>
  fetcher("/assets/poap/claim", {
    body,
  })

const useClaimPoap = (poap: Poap) => {
  const { id } = useUser()
  const showErrorToast = useShowErrorToast()

  const { mutate: mutatePoapLinks } = usePoapLinks(poap?.id)
  const triggerConfetti = useJsConfetti()

  return useSubmit<ClaimPoapBody, string>(
    async () => fetchClaim({ poapId: poap?.id, userId: id }),
    {
      onError: (error) => showErrorToast(error),
      onSuccess: () => {
        mutatePoapLinks()
        triggerConfetti()
      },
    }
  )
}

export default useClaimPoap
