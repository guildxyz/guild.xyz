import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"
import { revalidateContributions } from "../_server_actions/revalidateContributions"
import { useContributions } from "./useContributions"
import { useProfile } from "./useProfile"

export const useCreateContribution = () => {
  const { toast } = useToast()
  const { data: profile } = useProfile()
  const contributions = useContributions()

  if (!profile)
    throw new Error("Tried to create contribution outside profile context")
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
    onOptimistic: (response, payload) => {
      if (!profile?.userId) return
      contributions.mutate(
        async () => {
          if (!contributions.data) return
          const contribution = await response
          contributions.data[
            contributions.data.findLastIndex(({ id }) => id === -1)
          ] = contribution
          return contributions.data.filter(({ id }) => id !== -1)
        },
        {
          revalidate: false,
          rollbackOnError: true,
          optimisticData: () => {
            const fakeContribution: Schemas["Contribution"] = {
              ...payload,
              id: -1,
              userId: profile.userId,
            }
            if (!contributions.data) return [fakeContribution]
            contributions.data.push(fakeContribution)
            return contributions.data
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
        title: "Failed to create contribution",
        description: response.error,
      })
    },
  })
  return {
    ...submitWithSign,
    onSubmit: (payload: Schemas["ContributionUpdate"]) =>
      submitWithSign.onSubmit(payload),
  }
}
