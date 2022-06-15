import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import fetcher from "utils/fetcher"

type UploadMintLinksData = {
  poapId: number
  links: string[]
}

const fetchData = (data: UploadMintLinksData) =>
  fetcher("/assets/poap/links", { body: data })

const useUploadMintLinks = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { urlName } = useGuild()
  const { mutate } = useSWRConfig()

  return useSubmit<UploadMintLinksData, any>(fetchData, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      toast({
        title: "Successfuly uploaded mint links!",
        status: "success",
      })

      // Mutating the guild data, so we get back the correct "activated" status for the POAPs
      mutate([`/guild/${urlName}`, undefined])
    },
  })
}

export default useUploadMintLinks
