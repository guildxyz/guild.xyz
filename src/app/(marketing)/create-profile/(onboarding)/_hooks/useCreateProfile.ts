import { useConfetti } from "@/components/Confetti"
import { useToast } from "@/components/ui/hooks/useToast"
import { Schemas } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import getColorByImage from "utils/getColorByImage"

export const useCreateProfile = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { confettiPlayer } = useConfetti()
  const user = useUser()

  const createProfile = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/profiles`, {
      method: "POST",
      ...signedValidation,
    })

  const submitWithSign = useSubmitWithSign<Schemas["Profile"]>(createProfile, {
    onSuccess: async (response) => {
      toast({
        variant: "success",
        title: "Successfully created profile",
      })
      confettiPlayer.current("Confetti from left and right")
      await user.mutate()
      router.replace(`/profile/${response.username}`)
    },
    onError: (response) => {
      toast({
        variant: "error",
        title: "Failed to create profile",
        description: response.error,
      })
    },
  })
  return {
    ...submitWithSign,
    onSubmit: async (payload: Schemas["ProfileCreation"]) => {
      if (!payload.profileImageUrl) return submitWithSign.onSubmit(payload)

      const dominantColor = await getColorByImage(payload.profileImageUrl)
      const data = { ...payload, backgroundImageUrl: dominantColor }
      return submitWithSign.onSubmit(data)
    },
  }
}
