import { useDIDcheck } from "../hooks/useDIDcheck"
import MintPolygonID from "./MintPolygonIdProofModal"
import NoDID from "./NoDID"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const MintPolygonIdProof = ({ isOpen, onClose }: Props) => {
  const { error } = useDIDcheck()

  if (error) return <NoDID isOpen={isOpen} onClose={onClose} />

  return <MintPolygonID isOpen={isOpen} onClose={onClose} />
}

export { MintPolygonIdProof }
