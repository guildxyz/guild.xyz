import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"

type Payload = Partial<Pick<Schemas["Profile"], "username" | "id">>

export const useDeleteProfile = () => {
  const { toast } = useToast()

  const createProfile = async (signedValidation: SignedValidation) => {
    const { username, id } = JSON.parse(signedValidation.signedPayload) as Payload
    return fetcher(`/v2/profiles/${username || id}`, {
      method: "DELETE",
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<Payload>(createProfile, {
    onSuccess: (response) => {
      console.log(response)
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
    onSubmit: (payload: Payload) => submitWithSign.onSubmit(payload),
  }
}
