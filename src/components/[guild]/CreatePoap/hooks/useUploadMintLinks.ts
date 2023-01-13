import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { WithValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useState } from "react"
import fetcher from "utils/fetcher"
import { useCreatePoapContext } from "../components/CreatePoapContext"
import usePoapLinks from "./usePoapLinks"

type UploadMintLinksData = {
  poapId: number // (event ID)
  links: string[]
}

const useUploadMintLinks = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { mutateGuild } = useGuild()

  const { poapData } = useCreatePoapContext()
  const { mutate: mutatePoapLinks } = usePoapLinks(poapData?.id)

  const [loadingText, setLoadingText] = useState<string>(null)

  const uploadMintLinks = async ({
    validation,
    data,
  }: WithValidation<UploadMintLinksData>) => {
    // Temporarily disabled this feature, we'll need another solution for it.
    // setLoadingText("Validating mint links")
    // const checkMintLinksRes: { validated: boolean } = await fetcher(
    //   "/api/poap/check-mint-links",
    //   {
    //     body: data,
    //   }
    // )

    // if (!checkMintLinksRes.validated) return Promise.reject("Invalid mint links")

    setLoadingText("Saving mint links")

    return fetcher("/assets/poap/links", { validation, body: data })
  }

  return {
    ...useSubmitWithSign<UploadMintLinksData, any>(uploadMintLinks, {
      onError: (error) =>
        showErrorToast(error?.error?.message ?? error?.error ?? error),
      onSuccess: () => {
        toast({
          title: "Successfully uploaded mint links!",
          status: "success",
        })

        // Mutating the guild data & mint links, so we get back the correct "activated" status for the POAPs
        mutateGuild()
        mutatePoapLinks()
      },
    }),
    loadingText,
  }
}

export default useUploadMintLinks
