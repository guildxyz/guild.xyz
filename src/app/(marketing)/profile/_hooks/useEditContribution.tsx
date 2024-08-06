import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
// import { useSetAtom } from "jotai"
import fetcher from "utils/fetcher"
// import { profileAtom } from "../[username]/atoms"

// export type IdOrUsername = {
//   idOrUsername: Schemas["Profile"]["username"] | Schemas["Profile"]["id"]
// }

export interface ProfileId {
  profileId: Schemas["Profile"]["id"]
}
export type EditProfilePayload = Schemas["ProfileContributionUpdate"]

export const useEditContribution = ({
  method = "POST",
  profileId,
}: { method?: "POST" | "DELETE" | "PUT" } & ProfileId) => {
  const { toast } = useToast()
  // const setProfile = useSetAtom(profileAtom)

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
