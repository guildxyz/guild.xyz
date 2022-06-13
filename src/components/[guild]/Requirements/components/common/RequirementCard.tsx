import {
  Box,
  Center,
  Circle,
  Divider,
  HStack,
  Img,
  SkeletonCircle,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import { RPC } from "connectors"
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

      <ColorCardLabel
        type={requirement?.type}
        typeBackgroundColors={RequirementTypeColors}
        typeLabel={{ ERC1155: "NFT", ERC721: "NFT" }}
        typeColors={{ ALLOWLIST: "gray.700" }}
        bottom="-px"
        right="-px"
        borderTopLeftRadius="xl"
        borderBottomRightRadius="xl"
      >
        {["COIN", "ERC20", "ERC721", "ERC1155"].includes(requirement?.type) &&
          requirement?.chain && (
            <Center
              pl={2}
              pr={5}
              mr="-3"
              mb="1px"
              backgroundColor={colorMode === "light" ? "gray.100" : "blackAlpha.300"}
            >
              <Tooltip label={requirement?.chain}>
                <Img src={RPC[requirement?.chain]?.iconUrls?.[0]} boxSize={4} />
              </Tooltip>
            </Center>
          )}
      </ColorCardLabel>
    </ColorCard>
  )
}

export default RequirementCard
