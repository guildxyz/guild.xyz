import { ModalFooter } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const InfoModalFooter = (): JSX.Element => {
  const { onInfoModalClose } = useGuildCheckoutContext()

  return (
    <ModalFooter>
      <Button
        size="lg"
        colorScheme="blue"
        w="full"
        onClick={onInfoModalClose}
        data-dd-action-name="CloseModalButton (GuildCheckout)"
      >
        Close
      </Button>
    </ModalFooter>
  )
}

export default InfoModalFooter
