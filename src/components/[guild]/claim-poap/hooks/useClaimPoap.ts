import useUser from "components/[guild]/hooks/useUser"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useRouter } from "next/router"
import fetcher from "utils/fetcher"

type ClaimPoapBody = {
  poapId: number
  userId: number
}

const fetchClaim = async (body: ClaimPoapBody) =>
  fetcher("/assets/poap/claim", {
    body,
  })

const useClaimPoap = (onSuccess?: () => void) => {
  const router = useRouter()

  const { id } = useUser()
  const { poap } = usePoap(router.query.fancyId?.toString())

  const showErrorToast = useShowErrorToast()

  return useSubmit<ClaimPoapBody, string>(
    async () => fetchClaim({ poapId: poap?.id, userId: id }),
    {
      onError: (error) => showErrorToast(error),
      onSuccess: () => onSuccess?.(),
    }
  )
}

export default useClaimPoap
