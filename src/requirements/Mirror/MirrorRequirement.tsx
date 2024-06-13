import { Text } from "@chakra-ui/react"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import shortenHex from "utils/shortenHex"
import useMirrorEdition from "./hooks/useMirrorEdition"

const MirrorRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const { isLoading, name, image, error } = useMirrorEdition(
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    requirement.address,
    requirement.chain
  )

  return (
    <Requirement
      image={
        image ?? (
          <Text as="span" fontWeight="bold" fontSize="xx-small">
            MIRROR
          </Text>
        )
      }
      isImageLoading={isLoading}
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      footer={!error && <BlockExplorerUrl />}
      {...props}
    >
      <Text as="span">{`Own the `}</Text>
      <DataBlock
        isLoading={isLoading}
        error={error && "API error, please contact Mirror to report"}
      >
        {name ?? shortenHex(requirement.address, 3)}
      </DataBlock>
      <Text as="span">{` Mirror edition`}</Text>
    </Requirement>
  )
}

export default MirrorRequirement
