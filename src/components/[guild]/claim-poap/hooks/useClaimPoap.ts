import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { UseSubmitOptions, useSubmitWithSign } from "hooks/useSubmit/useSubmit"
import { useFetcherWithSign } from "utils/fetcher"

const useClaimPoap = (poapId: number, { onSuccess }: UseSubmitOptions = {}) => {
  const { id } = useUser()
  const { id: guildId } = useGuild()
  // const showErrorToast = useShowErrorToast()

  const { mutate: mutatePoapLinks } = usePoapLinks(poapId)
  const triggerConfetti = useJsConfetti()
  const fetcherWithSign = useFetcherWithSign()

  return useSubmitWithSign(
    () =>
      fetcherWithSign([
        `/v2/guilds/${guildId}/poaps/${poapId}/links/users/${id}`,
        { method: "POST" },
      ]),
    {
      // onError: (error) => showErrorToast(error),
      onSuccess: () => {
        triggerConfetti()
        mutatePoapLinks()
        onSuccess?.()
      },
    }
  )
}

export default useClaimPoap
