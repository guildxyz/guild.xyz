import { ModalFooter } from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { useEffect } from "react"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const InfoModalFooter = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
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

    captureEvent(
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
      >
        {isJoinButton ? "Join guild" : "Close"}
      </Button>
    </ModalFooter>
  )
}

export default InfoModalFooter
