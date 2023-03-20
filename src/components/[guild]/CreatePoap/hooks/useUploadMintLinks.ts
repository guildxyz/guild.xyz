import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useState } from "react"
import fetcher from "utils/fetcher"
import usePoapLinks from "./usePoapLinks"

type UploadMintLinksData = {
  poapId: number
  links: string[]
}

const useUploadMintLinks = (poapId: number, { onSuccess }: UseSubmitOptions) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { mutateGuild } = useGuild()
  const { mutate: mutatePoapLinks } = usePoapLinks(poapId)

  const [loadingText, setLoadingText] = useState<string>(null)

  const uploadMintLinks = async (signedValidation: SignedValdation) => {
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

    return fetcher("/assets/poap/links", signedValidation)
  }

  const { onSubmit, ...rest } = useSubmitWithSign<UploadMintLinksData>(
    uploadMintLinks,
    {
      onError: (error) =>
        showErrorToast(error?.error?.message ?? error?.error ?? error),
      onSuccess: () => {
        toast({
          title: "Successfully uploaded mint links!",
          status: "success",
        })
        onSuccess?.()

        // Mutating the guild data & mint links, so we get back the correct "activated" status for the POAPs
        mutateGuild()
        mutatePoapLinks()
      },
    }
  )

  return {
    onSubmit: (links) => onSubmit({ links, poapId }),
    ...rest,
    loadingText,
  }
}

export default useUploadMintLinks
