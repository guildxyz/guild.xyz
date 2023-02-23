import { ModalFooter } from "@chakra-ui/react"
import Button from "components/common/Button"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { useEffect } from "react"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const InfoModalFooter = (): JSX.Element => {
  const { onInfoModalClose, txSuccess } = useGuildCheckoutContext()
  const openJoinModal = useOpenJoinModal()
  const isMember = useIsMember()

  useEffect(() => {
    if (!isMember || !txSuccess) return
    onInfoModalClose()
  }, [isMember, txSuccess])

  const isJoinButton = txSuccess && !isMember

  return (
    <ModalFooter>
      <Button
        size="lg"
        colorScheme={isJoinButton ? "green" : "blue"}
        w="full"
        onClick={isJoinButton ? openJoinModal : onInfoModalClose}
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
