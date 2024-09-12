import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"
import { revalidateContributions } from "../_server_actions/revalidateContributions"
import { useContributions } from "./useContributions"
import { useProfile } from "./useProfile"

export const useDeleteContribution = ({
  contributionId,
}: { contributionId: Schemas["Contribution"]["id"] }) => {
  const { toast } = useToast()
  const { data: profile } = useProfile()
  const contributions = useContributions()

  if (!profile)
    throw new Error("Tried to delete contribution outside profile context")
  const update = async (signedValidation: SignedValidation) => {
    return fetcher(
      `/v2/profiles/${profile.username}/contributions/${contributionId}`,
      {
        method: "DELETE",
        ...signedValidation,
      }
    )
  }

  const submitWithSign = useSubmitWithSign<object>(update, {
    onOptimistic: (response) => {
      contributions.mutate(
        async () => {
          await response
          return contributions.data?.filter((p) => p.id !== contributionId)
        },
        {
          revalidate: false,
          rollbackOnError: true,
          optimisticData: () => {
            if (!contributions.data) return []
            return contributions.data.filter((p) => p.id !== contributionId)
          },
        }
      )
    },
    onSuccess: () => {
      revalidateContributions({ username: profile.username })
    },
    onError: (response) => {
      toast({
        variant: "error",
        title: "Failed to delete contribution",
        description: response.error,
      })
    },
  })
  return {
    ...submitWithSign,
    onSubmit: () => profile && submitWithSign.onSubmit(),
  }
}
