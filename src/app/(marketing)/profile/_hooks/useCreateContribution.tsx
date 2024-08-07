import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
// import { useSetAtom } from "jotai"
import fetcher from "utils/fetcher"
import { useProfile } from "./useProfile"
// import { profileAtom } from "../[username]/atoms"

// export type IdOrUsername = {
//   idOrUsername: Schemas["Profile"]["username"] | Schemas["Profile"]["id"]
// }

export interface ProfileId {
  profileId: Schemas["Profile"]["id"]
}
export type EditProfilePayload = Schemas["ProfileContributionUpdate"]

export const useCreateContribution = () => {
  const { toast } = useToast()
  const { data: profile } = useProfile()

  const update = async (signedValidation: SignedValidation) => {
    return fetcher(
      `/v2/profiles/${(profile as Schemas["Profile"]).id}/contributions`,
      {
        method: "POST",
        ...signedValidation,
      }
    )
  }

  const submitWithSign = useSubmitWithSign<Schemas["Profile"]>(update, {
    onSuccess: (response) => {
      console.log("onSuccess", response)
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
    onSubmit: (payload: EditProfilePayload) =>
      profile && submitWithSign.onSubmit(payload),
  }
}
