import { useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import { GuildPlatform } from "types"
import { MintPolygonIdProof } from "./components/MintPolygonIdProof"

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
      <MintPolygonIdProof isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default PolygonIdCardButton
