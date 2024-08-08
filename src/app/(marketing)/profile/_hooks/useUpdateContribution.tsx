import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"
import { revalidateContribution } from "../_server_actions/revalidateContribution"
import { useContribution } from "./useContribution"
import { useProfile } from "./useProfile"

export const useUpdateContribution = ({
  contributionId,
}: { contributionId: Schemas["Contribution"]["id"] }) => {
  const { toast } = useToast()
  const { data: profile } = useProfile()
  const contribution = useContribution()

  const update = async (signedValidation: SignedValidation) => {
    return fetcher(
      `/v2/profiles/${(profile as Schemas["Profile"]).username}/contributions/${contributionId}`,
      {
        method: "PUT",
        ...signedValidation,
      }
    )
  }

  const submitWithSign = useSubmitWithSign<Schemas["Contribution"]>(update, {
    onSuccess: (response) => {
      contribution.mutate(
        (prev) => {
          if (!prev || !contribution.data) return
          // WARNING: should we validate here?
          return prev.map((p) =>
            p.id === (contribution.data as unknown as Schemas["Contribution"]).id
              ? response
              : p
          )
        },
        { revalidate: false }
      )
      revalidateContribution()
      toast({
        variant: "success",
        title: "Successfully updated contribution",
      })
    },
    onError: (response) => {
      toast({
        variant: "error",
        title: "Failed to update contribution",
        description: response.error,
      })
    },
  })
  return {
    ...submitWithSign,
    onSubmit: (payload: Schemas["ContributionUpdate"]) =>
      profile && submitWithSign.onSubmit(payload),
  }
}
