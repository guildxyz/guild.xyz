import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type SavePoapType = {
  fancyId: string
  poapId: number
  expiryDate: number
  guildId: number
}

const fetchData = async (data: SavePoapType) =>
  fetcher("/assets/poap", { body: data })

const useSavePoap = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()

  return useSubmit<SavePoapType, any>(fetchData, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      triggerConfetti()
      toast({
        title: "Successful POAP creation!",
        status: "success",
      })
    },
  })
}

export default useSavePoap
