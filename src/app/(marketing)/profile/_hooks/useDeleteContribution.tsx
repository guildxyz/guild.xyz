import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"
import { revalidateContribution } from "../_server_actions/revalidateContribution"
import { useContribution } from "./useContribution"
import { useProfile } from "./useProfile"

export const useDeleteContribution = ({
  contributionId,
}: { contributionId: Schemas["Contribution"]["id"] }) => {
  const { toast } = useToast()
  const { data: profile } = useProfile()
  const contribution = useContribution()

  const update = async (signedValidation: SignedValidation) => {
    return fetcher(
      `/v2/profiles/${(profile as Schemas["Profile"]).username}/contributions/${contributionId}`,
      {
        method: "DELETE",
        ...signedValidation,
      }
    )
  }

  const submitWithSign = useSubmitWithSign<object>(update, {
    onSuccess: () => {
      contribution.mutate(
        (prev) => {
          if (!prev || !contribution.data) return
          // WARNING: should we validate here?
          return prev.filter((p) => p.id !== contributionId)
        },
        { revalidate: false }
      )
      revalidateContribution()
      toast({
        variant: "success",
        title: "Successfully deleted contribution",
      })
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
