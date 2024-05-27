import { HStack, Text } from "@chakra-ui/react"
import { ProvidedValueDisplayProps } from "requirements"
import SnapshotSpaceLink from "../components/SnapshotSpaceLink"

const VotesProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  return (
    <HStack wrap={"wrap"} gap={1}>
      <Text>
        Number of votes in the <SnapshotSpaceLink requirement={requirement} />
      </Text>
    </HStack>
  )
}

export default VotesProvidedValue
