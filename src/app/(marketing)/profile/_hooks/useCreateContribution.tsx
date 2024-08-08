import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"
import { revalidateContribution } from "../_server_actions/revalidateContribution"
import { useContribution } from "./useContribution"
import { useProfile } from "./useProfile"

export type EditProfilePayload = Schemas["ContributionUpdate"]

export const useCreateContribution = () => {
  const { toast } = useToast()
  const { data: profile } = useProfile()
  const contribution = useContribution()

  const update = async (signedValidation: SignedValidation) => {
    return fetcher(
      `/v2/profiles/${(profile as Schemas["Profile"]).username}/contributions`,
      {
        method: "POST",
        ...signedValidation,
      }
    )
  }

  const submitWithSign = useSubmitWithSign<Schemas["Contribution"]>(update, {
    onSuccess: (response) => {
      contribution.mutate(
        (prev) => {
          // WARNING: should we validate here?
          if (!prev) return
          prev.push(response)
          return prev
        },
        { revalidate: false }
      )
      revalidateContribution()
      toast({
        variant: "success",
        title: "Successfully created contribution",
      })
    },
    onError: (response) => {
      toast({
        variant: "error",
        title: "Failed to create contribution",
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
