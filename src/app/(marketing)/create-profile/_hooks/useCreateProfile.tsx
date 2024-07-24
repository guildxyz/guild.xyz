import { useToast } from "@/components/ui/hooks/useToast"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import { z } from "zod"
import { profileSchema } from "../schemas"

export const useCreateProfile = () => {
  const router = useRouter()
  const { toast } = useToast()
  const triggerConfetti = useJsConfetti()

  const createProfile = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/profiles`, {
      method: "POST",
      ...signedValidation,
    })

  const submitWithSign = useSubmitWithSign<unknown>(createProfile, {
    onSuccess: (response) => {
      triggerConfetti()
      toast({
        variant: "success",
        title: "Successfully created profile",
      })
      // router.push(`/profile/${response.username}`)
    },
    onError: (error) =>
      toast({
        variant: "error",
        title: "Failed to create profile",
        description: error?.message,
      }),
  })
  return {
    ...submitWithSign,
    onSubmit: (payload: z.infer<typeof profileSchema>) =>
      submitWithSign.onSubmit(payload),
  }
}
