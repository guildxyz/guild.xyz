import { RewardCardButton } from "rewards/components/RewardCardButton"
import { useMintPolygonIDProofContext } from "./components/MintPolygonIDProofProvider"
import useConnectedDID from "./hooks/useConnectedDID"

const PolygonIDCardButton = () => {
  const { onConnectDIDModalOpen, onMintPolygonIDProofModalOpen } =
    useMintPolygonIDProofContext()
  const { isLoading, data } = useConnectedDID()

  return (
    <RewardCardButton
      onClick={data ? onMintPolygonIDProofModalOpen : onConnectDIDModalOpen}
      colorScheme="purple"
      isLoading={isLoading}
      loadingText="Checking your DID"
    >
      {data ? "Mint PolygonID Proofs" : "Connect DID"}
    </RewardCardButton>
  )
}

export default PolygonIDCardButton
