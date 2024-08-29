import { useToast } from "@/components/ui/hooks/useToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useParams, useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import { revalidateProfile } from "../_server_actions/revalidateProfile"

export const useDeleteProfile = () => {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const submit = async (signedValidation: SignedValidation) => {
    return fetcher(`/v2/profiles/${params?.username}`, {
      method: "DELETE",
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<object>(submit, {
    onSuccess: () => {
      revalidateProfile()
      router.replace("/create-profile/claim-pass")
      toast({
        variant: "success",
        title: "Successfully deleted profile",
      })
    },
    onError: (response) => {
      toast({
        variant: "error",
        title: "Failed to delete profile",
        description: response.error,
      })
    },
  })
  return {
    ...submitWithSign,
    onSubmit: () => params?.username && submitWithSign.onSubmit(),
  }
}
