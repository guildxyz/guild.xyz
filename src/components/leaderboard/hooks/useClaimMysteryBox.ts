import { useWeb3React } from "@web3-react/core"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import {
  MysteryBoxResponse,
  MYSTERY_BOX_MESSAGE_TO_SIGN,
} from "pages/api/leaderboard/mystery-box"
import { useState } from "react"
import fetcher from "utils/fetcher"
import { ClaimMysteryBoxForm } from "../MysteryBoxCard"
import useHasAlreadyClaimedMysteryBox from "./useHasAlreadyClaimedMysteryBox"

const useClaimMysteryBox = (onSuccess: () => void) => {
  const { account, provider } = useWeb3React()

  const [loadingText, setLoadingText] = useState<string>()

  const claim = async (data: ClaimMysteryBoxForm) => {
    setLoadingText("Check your wallet")

    const signedMessage = await provider
      .getSigner(account)
      .signMessage(MYSTERY_BOX_MESSAGE_TO_SIGN)

    setLoadingText("Saving data")

    return fetcher("/api/leaderboard/mystery-box", {
      body: {
        signedMessage,
        ...data,
      },
    })
  }

  const triggerConfetti = useJsConfetti()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { mutate } = useHasAlreadyClaimedMysteryBox()

  return {
    ...useSubmit<ClaimMysteryBoxForm, MysteryBoxResponse>(claim, {
      onSuccess: ({ message }) => {
        toast({
          title: "Congratulations",
          description: message,
          status: "success",
        })
        triggerConfetti()
        mutate({
          alreadyClaimed: true,
        })
        onSuccess()
      },
      onError: (error) => {
        const message = error.message ? "User rejected signing" : error.error
        showErrorToast({
          name: "Error",
          message,
        })
      },
    }),
    loadingText,
  }
}

export default useClaimMysteryBox
