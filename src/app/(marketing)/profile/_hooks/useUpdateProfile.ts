import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas, schemas } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/types"
import { useParams, useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import { revalidateContributions } from "../_server_actions/revalidateContributions"
import { revalidateProfile } from "../_server_actions/revalidateProfile"
import { useProfile } from "./useProfile"

export const useUpdateProfile = ({ onSuccess }: UseSubmitOptions) => {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const { mutate, data: profile } = useProfile()
  const user = useUser()

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
      await user.mutate()
      if (profile?.username !== response.username) {
        await revalidateContributions()
        router.replace(`/profile/${response.username}`)
      }
      onSuccess?.()
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
      params?.username &&
      submitWithSign.onSubmit(schemas.ProfileUpdateSchema.parse(payload)),
  }
}
