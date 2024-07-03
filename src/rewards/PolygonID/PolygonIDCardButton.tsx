import Button from "components/common/Button"
import { useMintPolygonIDProofContext } from "./components/MintPolygonIDProofProvider"
import useConnectedDID from "./hooks/useConnectedDID"

const PolygonIDCardButton = () => {
  const { onConnectDIDModalOpen, onMintPolygonIDProofModalOpen } =
    useMintPolygonIDProofContext()
  const { isLoading, data } = useConnectedDID()

  return (
    <Button
      onClick={data ? onMintPolygonIDProofModalOpen : onConnectDIDModalOpen}
      w="full"
      colorScheme="purple"
      isLoading={isLoading}
      loadingText="Checking your DID"
    >
      {data ? "Mint PolygonID Proofs" : "Connect DID"}
    </Button>
  )
}

export default PolygonIDCardButton
