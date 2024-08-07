import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"
import { useContribution } from "./useContribution"
import { useProfile } from "./useProfile"

export const useUpdateContribution = ({
  contributionId,
}: { contributionId: Schemas["ProfileContribution"]["id"] }) => {
  const { toast } = useToast()
  const { data: profile } = useProfile()
  const contribution = useContribution()

  const update = async (signedValidation: SignedValidation) => {
    return fetcher(
      `/v2/profiles/${(profile as Schemas["Profile"]).id}/contributions/${contributionId}`,
      {
        method: "PUT",
        ...signedValidation,
      }
    )
  }

  const submitWithSign = useSubmitWithSign<Schemas["ProfileContribution"]>(update, {
    onSuccess: (response) => {
      console.log("onSuccess", response)
      contribution.mutate((prev) => {
        if (!prev || !contribution.data) return
        // WARNING: should we validate here?
        const toBeMutatedIndex = prev?.findIndex(
          ({ id }) =>
            id ===
            (contribution.data as unknown as Schemas["ProfileContribution"]).id
        )!
        prev[toBeMutatedIndex] = response
        return prev
      })
      // toast({
      //   variant: "success",
      //   title: "Successfully updated contribution",
      // })
    },
    onError: (response) => {
      console.log("onError", response)
      toast({
        variant: "error",
        title: "Failed to update contribution",
        description: response.error,
      })
    },
  })
  return {
    ...submitWithSign,
    onSubmit: (payload: Schemas["ProfileContributionUpdate"]) =>
      profile && submitWithSign.onSubmit(payload),
  }
}
