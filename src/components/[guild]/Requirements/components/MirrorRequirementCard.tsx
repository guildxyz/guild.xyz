import { Skeleton, Text } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import useMirrorEdition from "components/create-guild/Requirements/components/MirrorV2FormCard/hooks/useMirrorEdition"
import { Requirement } from "types"
import BlockExplorerUrl from "./common/BlockExplorerUrl"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const MirrorRequirementCard = ({ requirement, ...rest }: Props): JSX.Element => {
  const { isLoading, name, image } = useMirrorEdition(
    requirement.address,
    requirement.chain
  )

  return (
    <RequirementCard
      requirement={requirement}
      image={
        isLoading
          ? ""
          : image ?? (
              <Text as="span" fontWeight="bold" fontSize="xx-small">
                MIRROR
              </Text>
            )
      }
      footer={<BlockExplorerUrl requirement={requirement} />}
      {...rest}
    >
      <Text as="span">{`Own the `}</Text>
      <Skeleton as="span" isLoaded={!isLoading}>
        {isLoading
          ? "Loading..."
          : name || <DataBlock>{requirement.address}</DataBlock>}
      </Skeleton>
      <Text as="span">{` Mirror edition`}</Text>
    </RequirementCard>
  )
}

export default MirrorRequirementCard
