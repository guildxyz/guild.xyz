import { HStack, Text } from "@chakra-ui/react"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"
import {
  SnapshotSpaceLink,
  SnapshotSpaceLinkProps,
} from "../components/SnapshotSpaceLink"

const ProposalsProvidedValue = ({ requirement }: ProvidedValueDisplayProps) =>
  requirement.data?.space ? (
    <HStack wrap={"wrap"} gap={1}>
      <Text>
        Number of proposals in the{" "}
        <SnapshotSpaceLink
          requirement={requirement as SnapshotSpaceLinkProps["requirement"]}
        />
      </Text>
    </HStack>
  ) : (
    "Number of proposals"
  )

export default ProposalsProvidedValue
