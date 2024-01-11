import { useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import MintPolygonIDProof from "./components/MintPolygonIDProof"
import useConnectedDID from "./hooks/useConnectedDID"

const PolygonIDCardButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isLoading } = useConnectedDID()

  return (
    <>
      <Button
        onClick={onOpen}
        w="full"
        colorScheme="purple"
        isLoading={isLoading}
        loadingText={"Checking your DID"}
      >
        Mint PolygonID Proofs
      </Button>
      <MintPolygonIDProof isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default PolygonIDCardButton
