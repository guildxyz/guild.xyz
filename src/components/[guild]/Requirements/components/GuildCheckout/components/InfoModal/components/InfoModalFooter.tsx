import { ModalFooter } from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { usePostHog } from "posthog-js/react"
import { useEffect } from "react"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const InfoModalFooter = (): JSX.Element => {
  const posthog = usePostHog()
  const { urlName } = useGuild()

  const { onInfoModalClose, txSuccess } = useGuildCheckoutContext()
  const openJoinModal = useOpenJoinModal()
  const isMember = useIsMember()

  useEffect(() => {
    if (!isMember || !txSuccess) return
    onInfoModalClose()
  }, [isMember, txSuccess])

  const isJoinButton = txSuccess && !isMember

  const onClick = () => {
    if (isJoinButton) {
      openJoinModal()
    } else {
      onInfoModalClose()
    }

    posthog.capture(
      `Click: ${
        isJoinButton ? "JoinGuildButton" : "CloseModalButton"
      } (GuildCheckout)`,
      {
        guild: urlName,
      }
    )
  }

  return (
    <ModalFooter>
      <Button
        size="lg"
        colorScheme={isJoinButton ? "green" : "blue"}
        w="full"
        onClick={onClick}
        data-dd-action-name={
          isJoinButton
            ? "JoinGuildButton (GuildCheckout)"
            : "CloseModalButton (GuildCheckout)"
        }
      >
        {isJoinButton ? "Join guild" : "Close"}
      </Button>
    </ModalFooter>
  )
}

export default InfoModalFooter
