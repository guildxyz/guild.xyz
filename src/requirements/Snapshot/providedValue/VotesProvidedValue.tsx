import { HStack, Text } from "@chakra-ui/react"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"
import SnapshotSpaceLink from "../components/SnapshotSpaceLink"

const VotesProvidedValue = ({ requirement }: ProvidedValueDisplayProps) =>
  !!requirement?.data?.space ? (
    <HStack wrap={"wrap"} gap={1}>
      <Text>
        Number of votes in <SnapshotSpaceLink requirement={requirement} />
      </Text>
    </HStack>
  ) : (
    "Number of votes"
  )

export default VotesProvidedValue
