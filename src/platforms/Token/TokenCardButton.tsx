import { useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import ClaimTokenModal from "./ClaimTokenModal"

const TokenCardButton = ({ isDisabled }: { isDisabled: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button colorScheme="gold" w="full" isDisabled={isDisabled} onClick={onOpen}>
        Claim
      </Button>
      <ClaimTokenModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default TokenCardButton
