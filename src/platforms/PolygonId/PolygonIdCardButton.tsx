import { useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import { GuildPlatform } from "types"
import { MintPolygonIdProofModal } from "./components/MintPolygonIdProofModal"

type Props = {
  platform: GuildPlatform
}

const PolygonIdCardButton = ({ platform }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen} w="full" colorScheme="purple">
        Mint PolygonID Proofs
      </Button>
      <MintPolygonIdProofModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default PolygonIdCardButton
