import useConnectedDID from "../hooks/useConnectedDID"
import ConnectDIDModal from "./ConnectDIDModal"
import MintPolygonIDProofModal from "./MintPolygonIDProofModal"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const MintPolygonIDProof = ({ isOpen, onClose }: Props) => {
  const { data } = useConnectedDID()

  if (!data) return <ConnectDIDModal isOpen={isOpen} onClose={onClose} />
  return <MintPolygonIDProofModal isOpen={isOpen} onClose={onClose} />
}

export default MintPolygonIDProof
