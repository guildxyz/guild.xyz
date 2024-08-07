import { useToast } from "@/components/ui/hooks/useToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useParams, useRouter } from "next/navigation"
import fetcher from "utils/fetcher"

export const useDeleteProfile = () => {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const createProfile = async (signedValidation: SignedValidation) => {
    return fetcher(`/v2/profiles/${params?.username}`, {
      method: "DELETE",
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<object>(createProfile, {
    onSuccess: () => {
      router.replace("/create-profile")
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
