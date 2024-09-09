import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas, schemas } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/types"
import { useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import { revalidateContributions } from "../_server_actions/revalidateContributions"
import { revalidateProfile } from "../_server_actions/revalidateProfile"
import { useProfile } from "./useProfile"

export const useUpdateProfile = ({ onSuccess }: UseSubmitOptions) => {
  const { toast } = useToast()
  const router = useRouter()
  const { mutate: mutateProfile, data: profile } = useProfile()
  const user = useUser()

  if (!profile) throw new Error("Tried to update profile outside profile context")
  const updateProfile = async (signedValidation: SignedValidation) => {
    return fetcher(`/v2/profiles/${profile.username}`, {
      method: "PUT",
      ...signedValidation,
    })
  }

  const submitWithSign = useSubmitWithSign<Schemas["Profile"]>(updateProfile, {
    onOptimistic: (response, payload) => {
      mutateProfile(() => response, {
        revalidate: false,
        rollbackOnError: true,
        optimisticData: () => ({ ...profile, ...payload }),
      })
    },
    onSuccess: async (response) => {
      user.mutate()
      revalidateProfile({ username: profile.username })
      if (profile.username !== response.username) {
        mutateProfile()
        revalidateContributions({ username: profile.username })
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
      submitWithSign.onSubmit(schemas.ProfileUpdateSchema.parse(payload)),
  }
}
