import { useToast } from "@/components/ui/hooks/useToast"
import useUser from "components/[guild]/hooks/useUser"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import { revalidateProfile } from "../_server_actions/revalidateProfile"
import { useProfile } from "./useProfile"

export const useDeleteProfile = () => {
  const { toast } = useToast()
  const router = useRouter()
  const { data: profile } = useProfile()
  const user = useUser()

  if (!profile) throw new Error("Tried to delete profile outside profile context")
  const submit = async (signedValidation: SignedValidation) => {
    return fetcher(`/v2/profiles/${profile.username}`, {
      method: "DELETE",
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<object>(submit, {
    onSuccess: () => {
      console.log("revalidating", profile)
      revalidateProfile({ username: profile.username })
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
    onSubmit: () => profile?.username && submitWithSign.onSubmit(),
  }
}
