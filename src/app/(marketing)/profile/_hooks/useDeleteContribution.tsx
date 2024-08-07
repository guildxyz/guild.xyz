import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"

export type EditProfilePayload = Schemas["ProfileContributionUpdate"]

export const useCreateContribution = ({ profileId }: ProfileId) => {
  const { toast } = useToast()

  const updateProfile = async (signedValidation: SignedValidation) => {
    // const { profileId } = JSON.parse(
    //   signedValidation.signedPayload
    // ) as EditProfilePayload
    return fetcher(`/v2/profiles/${profileId}/contributions`, {
      method,
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<Schemas["Profile"]>(updateProfile, {
    onSuccess: (response) => {
      console.log("onSuccess", response)
      // setProfile(response)
      toast({
        variant: "success",
        title: "Successfully updated contributions",
      })
    },
    onError: (response) => {
      console.log("onError", response)
      toast({
        variant: "error",
        title: "Failed to update contributions",
        description: response.error,
      })
    },
  })
  return {
    ...submitWithSign,
    onSubmit: (payload: EditProfilePayload) => submitWithSign.onSubmit(payload),
  }
}
