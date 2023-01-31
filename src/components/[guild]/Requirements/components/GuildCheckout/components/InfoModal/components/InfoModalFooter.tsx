import { ModalFooter } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const InfoModalFooter = (): JSX.Element => {
  const {
    processing,
    success,
    setProcessing,
    setSuccess,
    setTxError,
    onInfoModalClose,
  } = useGuildCheckoutContext()

  return (
    <ModalFooter>
      <Button
        size="xl"
        colorScheme="blue"
        w="full"
        onClick={
          processing
            ? () => {
                setSuccess(true)
                setProcessing(false)
              }
            : success
            ? () => {
                setTxError(true)
                setSuccess(false)
              }
            : onInfoModalClose
        }
      >
        Close
      </Button>
    </ModalFooter>
  )
}

export default InfoModalFooter
