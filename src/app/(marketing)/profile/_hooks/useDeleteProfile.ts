import { useToast } from "@/components/ui/hooks/useToast"
import useUser from "components/[guild]/hooks/useUser"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useParams, useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import { revalidateProfile } from "../_server_actions/revalidateProfile"

export const useDeleteProfile = () => {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const user = useUser()

  const submit = async (signedValidation: SignedValidation) => {
    return fetcher(`/v2/profiles/${params?.username}`, {
      method: "DELETE",
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<object>(submit, {
    onSuccess: () => {
      revalidateProfile()
      user.mutate()
      router.replace("/create-profile/prompt-referrer")
      toast({
        variant: "success",
        title: "Successfully deleted profile",
        description: "Redirecting you to the Create profile page",
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
