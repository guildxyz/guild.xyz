import { useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import { MintPolygonIdProof } from "./components/MintPolygonIdProof"
import useConnectedDID from "./hooks/useConnectedDID"

const PolygonIdCardButton = () => {
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
      <MintPolygonIdProof isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default PolygonIdCardButton
