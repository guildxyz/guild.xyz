import Button from "components/common/Button"
import { GuildPlatform } from "types"
import useMintPolygonIdProof, {
  MintPolygonIdProofModal,
} from "./hooks/useMintPolygonIdProof"

type Props = {
  platform: GuildPlatform
}

const PolygonIdCardButton = ({ platform }: Props) => {
  const {
    modalProps: { isOpen, onClose, onOpen },
    roles,
  } = useMintPolygonIdProof()

  return (
    <>
      <Button onClick={onOpen} w="full" colorScheme="purple">
        Mint PolygonID Proofs
      </Button>
      <MintPolygonIdProofModal isOpen={isOpen} onClose={onClose} roles={roles} />
    </>
  )
}

export default PolygonIdCardButton
