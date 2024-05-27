import { HStack, Text } from "@chakra-ui/react"
import { ProvidedValueDisplayProps } from "requirements"
import SnapshotSpaceLink from "../components/SnapshotSpaceLink"

const ProposalsProvidedValue = ({ requirement }: ProvidedValueDisplayProps) =>
  requirement.data?.space ? (
    <HStack wrap={"wrap"} gap={1}>
      <Text>
        Number of proposals in the <SnapshotSpaceLink requirement={requirement} />
      </Text>
    </HStack>
  ) : (
    "Number of proposals"
  )

export default ProposalsProvidedValue
