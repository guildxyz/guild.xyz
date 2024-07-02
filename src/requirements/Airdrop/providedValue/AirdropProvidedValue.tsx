import { HStack, Text, useDisclosure } from "@chakra-ui/react"
import SnapshotModal from "components/[guild]/leaderboard/Snapshots/SnapshotModal"
import Button from "components/common/Button"
import { ArrowSquareIn } from "phosphor-react"
import { ProvidedValueDisplayProps } from "requirements"

const AirdropProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <HStack gap={1}>
      <Text>Points in</Text>
      <Button
        variant="link"
        rightIcon={<ArrowSquareIn />}
        iconSpacing={0.5}
        onClick={onOpen}
      >
        {"snapshot"}
      </Button>

      <SnapshotModal
        onClose={onClose}
        isOpen={isOpen}
        snapshotRequirement={requirement}
      />
    </HStack>
  )
}

export default AirdropProvidedValue
