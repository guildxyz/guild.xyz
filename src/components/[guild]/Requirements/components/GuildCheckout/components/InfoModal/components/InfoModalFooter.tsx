import { ModalFooter } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const InfoModalFooter = (): JSX.Element => {
  const { onInfoModalClose } = useGuildCheckoutContext()

  return (
    <ModalFooter>
      <Button size="xl" colorScheme="blue" w="full" onClick={onInfoModalClose}>
        Close
      </Button>
    </ModalFooter>
  )
}

export default InfoModalFooter
