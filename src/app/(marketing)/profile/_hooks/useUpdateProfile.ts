import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useParams, useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import { revalidateProfile } from "../_server_actions/revalidateProfile"
import { useProfile } from "./useProfile"
import { revalidateContribution } from "../_server_actions/revalidateContribution"

export const useUpdateProfile = () => {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const { mutate, data: profile } = useProfile()

  const updateProfile = async (signedValidation: SignedValidation) => {
    return fetcher(`/v2/profiles/${params?.username}`, {
      method: "PUT",
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<Schemas["Profile"]>(updateProfile, {
    onOptimistic: (response, payload) => {
      mutate(() => response, {
        revalidate: false,
        rollbackOnError: true,
        optimisticData: () => payload,
      })
    },
    onSuccess: async (response) => {
      await revalidateProfile()
      if (profile?.username !== response.username) {
        await revalidateContribution()
        router.replace(`/profile/${response.username}`)
      }
    },
    onError: (response) => {
      toast({
        variant: "error",
        title: "Failed to update profile",
        description: response.error,
      })
    },
  })
  return {
    ...submitWithSign,
    onSubmit: (payload: Schemas["ProfileUpdate"]) =>
      params?.username && submitWithSign.onSubmit(payload),
  }
}
