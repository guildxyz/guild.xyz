import { Text } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import shortenHex from "utils/shortenHex"
import BlockExplorerUrl from "../../components/[guild]/Requirements/components/BlockExplorerUrl"
import useMirrorEdition from "./hooks/useMirrorEdition"

const MirrorRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const { isLoading, name, image, error } = useMirrorEdition(
    requirement.address,
    requirement.chain
  )

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={
        image ?? (
          <Text as="span" fontWeight="bold" fontSize="xx-small">
            MIRROR
          </Text>
        )
      }
      isImageLoading={isLoading}
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
