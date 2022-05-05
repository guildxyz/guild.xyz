import { Box, Divider, HStack, Img, SkeletonCircle } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import RequirementChainTypeText from "components/create-guild/Requirements/components/RequirementChainTypeText"
import { PropsWithChildren } from "react"
import { Requirement, RequirementTypeColors, Rest } from "types"
import RequirementText from "./RequirementText"

type Props = {
  requirement: Requirement
  loading?: boolean
  image?: string
  footer?: JSX.Element
} & Rest

const RequirementCard = ({
  requirement,
  loading,
  image,
  footer,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <ColorCard
    color={RequirementTypeColors[requirement?.type]}
    boxShadow="none"
    alignItems="left"
    {...rest}
  >
    <Box w="full">
      <HStack spacing={4} alignItems="start">
        {image && (
          <SkeletonCircle minW={10} boxSize={10} isLoaded={!loading}>
            <Img src={image} alt={requirement.address} width={10} />
          </SkeletonCircle>
        )}
        <Box pt={2}>
          <RequirementText>{children}</RequirementText>
        </Box>
      </HStack>

      {footer && (
        <>
          <Divider w="full" my={4} />
          {footer}
        </>
      )}
    </Box>

    <RequirementChainTypeText
      requirementChain={requirement?.chain}
      requirementType={requirement?.type}
      bottom="-px"
      right="-px"
      borderTopLeftRadius="xl"
      borderBottomRightRadius="xl"
    />
  </ColorCard>
)

export default RequirementCard
