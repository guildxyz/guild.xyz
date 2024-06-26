import { Text } from "@chakra-ui/react"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import shortenHex from "utils/shortenHex"
import { Chain } from "wagmiConfig/chains"
import useMirrorEdition from "./hooks/useMirrorEdition"

const MirrorRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  // TODO: we could remove the cast once we'll have schemas for this requirement
  const requirementChain = requirement.chain as Chain
  const requirementAddress = requirement.address as `0x${string}`

  const { isLoading, name, image, error } = useMirrorEdition(
    requirementAddress,
    requirementChain
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
      footer={!error && <BlockExplorerUrl />}
      {...props}
    >
      <Text as="span">{`Own the `}</Text>
      <DataBlock
        isLoading={isLoading}
        error={error && "API error, please contact Mirror to report"}
      >
        {name ?? shortenHex(requirementAddress, 3)}
      </DataBlock>
      <Text as="span">{` Mirror edition`}</Text>
    </Requirement>
  )
}

export default MirrorRequirement
