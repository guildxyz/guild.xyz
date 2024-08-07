import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useParams, useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import { useProfile } from "./useProfile"

export const useUpdateProfile = () => {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const { mutate } = useProfile()

  const updateProfile = async (signedValidation: SignedValidation) => {
    return fetcher(`/v2/profiles/${params?.username}`, {
      method: "PUT",
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<Schemas["Profile"]>(updateProfile, {
    onSuccess: (response) => {
      console.log("onSuccess", response)
      router.replace(`/profile/${response.username}`)
      mutate(() => response, { revalidate: false })
      toast({
        variant: "success",
        title: "Successfully updated profile",
      })
    },
    onError: (response) => {
      console.log("onError", response)
      toast({
        variant: "error",
        title: "Failed to update profile",
        description: response.error,
      })
    },
  })
  return {
    ...submitWithSign,
    onSubmit: (payload: Schemas["ProfileUpdate"]) =>
      params?.username && submitWithSign.onSubmit(payload),
  }
}
