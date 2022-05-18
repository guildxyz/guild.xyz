import {
  Box,
  Circle,
  Divider,
  HStack,
  Img,
  SkeletonCircle,
  useColorMode,
} from "@chakra-ui/react"
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
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <ColorCard
      color={RequirementTypeColors[requirement?.type]}
      boxShadow="none"
      alignItems="left"
      {...rest}
    >
      <Box w="full">
        <HStack spacing={4}>
          {image && (
            <SkeletonCircle minW={10} boxSize={10} isLoaded={!loading}>
              <Circle
                size={10}
                backgroundColor={
                  colorMode === "light" ? "gray.100" : "blackAlpha.300"
                }
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
              >
                <Img src={image} alt={requirement.address} maxWidth={10} />
              </Circle>
            </SkeletonCircle>
          )}
          <RequirementText>{children}</RequirementText>
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
}

export default RequirementCard
