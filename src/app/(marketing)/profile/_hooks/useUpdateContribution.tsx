import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"
import { revalidateContribution } from "../_server_actions/revalidateContribution"
import { useContributions } from "./useContributions"
import { useProfile } from "./useProfile"

export const useUpdateContribution = ({
  contributionId,
}: { contributionId: Schemas["Contribution"]["id"] }) => {
  const { toast } = useToast()
  const { data: profile } = useProfile()
  const contributions = useContributions()

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
    onOptimistic: (response, payload) => {
      if (!profile?.userId) return
      contributions.mutate(
        async () => {
          if (!contributions.data) return
          const contribution = await response
          return contributions.data.map((data) =>
            data.id === contributionId ? contribution : data
          )
        },
        {
          revalidate: false,
          rollbackOnError: true,
          optimisticData: () => {
            if (!contributions.data) return []
            return contributions.data.map((data) =>
              data.id === contributionId
                ? { ...data, ...(payload as Schemas["Contribution"]) }
                : data
            )
          },
        }
      )
    },
    onSuccess: () => {
      revalidateContribution()
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
