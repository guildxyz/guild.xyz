import useConnectedDID from "../hooks/useConnectedDID"
import MintPolygonIDProofModal from "./MintPolygonIDProofModal"
import NoDID from "./NoDID"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const MintPolygonIDProof = ({ isOpen, onClose }: Props) => {
  const { error } = useConnectedDID()

  if (error) return <NoDID isOpen={isOpen} onClose={onClose} />

  return <MintPolygonIDProofModal isOpen={isOpen} onClose={onClose} />
}

export default MintPolygonIDProof
