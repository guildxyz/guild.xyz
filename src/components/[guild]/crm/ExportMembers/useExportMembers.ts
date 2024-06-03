import useGuild from "components/[guild]/hooks/useGuild"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import fetcher from "utils/fetcher"

const useExportMembers = (onSuccess) => {
  const { id } = useGuild()
  const toast = useToast()
  const router = useRouter()

  const { onSubmit, isLoading, ...rest } = useSubmitWithSign(
    (signedValidation: SignedValidation) =>
      fetcher(`/v2/crm/guilds/${id}/exports`, {
        method: "POST",
        ...signedValidation,
      }),
    {
      onSuccess: (res) => {
        toast({
          status: "success",
          title: "Export started",
          description:
            "It might take some time to finish based on the number of members",
        })
        onSuccess?.()
      },
      onError: (err) => {
        toast({
          status: "error",
          title: "Couldn't start export",
        })
      },
    }
  )

  return {
    startExport: () => onSubmit(router.query),
    isStartExportLoading: isLoading,
    ...rest,
  }
}

export default useExportMembers
