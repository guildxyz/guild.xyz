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
  const contributions = useContribution()

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
          contributions.data[contributions.data.findIndex(({ id }) => id === -1)] =
            contribution
          // contributions.data.push(await response)
          return contributions.data
        },
        {
          revalidate: false,
          rollbackOnError: true,
          optimisticData: () => {
            const fakeContribution: Schemas["Contribution"] = {
              ...(payload as EditProfilePayload),
              id: -1,
              profileId: profile.userId,
            }
            if (!contributions.data) return [fakeContribution]
            contributions.data.push(fakeContribution)
            return contributions.data
          },
        }
      )
    },
    onSuccess: (response) => {
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
