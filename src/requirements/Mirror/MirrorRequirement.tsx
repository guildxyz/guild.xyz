import { Skeleton, Text } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import BlockExplorerUrl from "../common/BlockExplorerUrl"
import Requirement from "../common/Requirement"
import useMirrorEdition from "./hooks/useMirrorEdition"

const MirrorRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => {
  const { isLoading, name, image, error } = useMirrorEdition(
    requirement.address,
    requirement.chain
  )

  return (
    <Requirement
      image={
        isLoading
          ? ""
          : image ?? (
              <Text as="span" fontWeight="bold" fontSize="xx-small">
                MIRROR
              </Text>
            )
      }
      footer={!error && <BlockExplorerUrl requirement={requirement} />}
      {...rest}
    >
      <Text as="span">{`Own the `}</Text>
      <Skeleton as="span" isLoaded={!isLoading}>
        {isLoading
          ? "Loading..."
          : name || <DataBlock>{requirement.address}</DataBlock>}
      </Skeleton>
      <Text as="span">{` Mirror edition`}</Text>
    </Requirement>
  )
}

export default MirrorRequirement
