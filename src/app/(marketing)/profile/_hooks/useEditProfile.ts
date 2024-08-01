import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import { profileAtom } from "../[username]/atoms"

export type EditProfilePayload = Schemas["ProfileUpdate"] &
  Pick<Schemas["Profile"], "id">
export const useEditProfile = () => {
  const { toast } = useToast()
  const router = useRouter()
  const setProfile = useSetAtom(profileAtom)

  const updateProfile = async (signedValidation: SignedValidation) => {
    const { id } = JSON.parse(signedValidation.signedPayload) as EditProfilePayload
    return fetcher(`/v2/profiles/${id}`, {
      method: "PUT",
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<Schemas["Profile"]>(updateProfile, {
    onSuccess: (response) => {
      console.log("onSuccess", response)
      setProfile(response)
      router.replace(`/profile/${response.username}`)
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
    onSubmit: (payload: EditProfilePayload) => submitWithSign.onSubmit(payload),
  }
}
