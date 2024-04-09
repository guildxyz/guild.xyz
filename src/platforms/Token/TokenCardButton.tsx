import { useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import ClaimTokenModal from "./ClaimTokenModal"

const TokenCardButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button colorScheme="primary" w="full" isDisabled={false} onClick={onOpen}>
        Claim
      </Button>
      <ClaimTokenModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default TokenCardButton
