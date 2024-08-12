import {
  Box,
  ChakraProps,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import Image from "next/image"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  label?: string | JSX.Element
  title: string
  titleRightElement?: JSX.Element
  description?: string | JSX.Element
  image: string | JSX.Element
  colorScheme: ChakraProps["color"]
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
} & Rest

const RewardCard = ({
  label,
  title,
  titleRightElement,
  description,
  image,
  colorScheme,
  actionRow,
  cornerButton,
  children,
  ...rest
}: PropsWithChildren<Props>) => (
  <ColorCard
    color={`${colorScheme}.500`}
    pt={{ base: 10, sm: 11 }}
    display="flex"
    flexDir={{ base: "column", sm: "row", md: "column", lg: "row", xl: "column" }}
    gap={5}
    justifyContent="space-between"
    {...rest}
  >
    {cornerButton && (
      <Box position="absolute" top={2} right={2}>
        {cornerButton}
      </Box>
    )}
    <Flex
      justifyContent={"space-between"}
      flexDirection={{ base: "column", md: "row" }}
    >
      <HStack spacing={3} minHeight={10}>
        {typeof image === "string" ? (
          <>
            {image.length > 0 ? (
              <Box
                overflow={"hidden"}
                borderRadius="full"
                boxSize={10}
                flexShrink={0}
                position="relative"
              >
                <Image src={image} alt={title} fill sizes="2.5rem" />
              </Box>
            ) : (
              <SkeletonCircle size="10" />
            )}
          </>
        ) : (
          image
        )}
        <Stack spacing={0}>
          <HStack spacing="0">
            <Skeleton isLoaded={!!title}>
              <Text fontWeight={"bold"}>{title || "Loading reward..."}</Text>
            </Skeleton>

            {titleRightElement}
          </HStack>
          {typeof description === "string" ? (
            <Text as="span" color="gray" fontSize="sm" noOfLines={3}>
              {description}
            </Text>
          ) : (
            description
          )}
        </Stack>
      </HStack>
      {actionRow}
    </Flex>

    {children}

    {label && (
      <ColorCardLabel
        fallbackColor="white"
        backgroundColor={`${colorScheme}.500`}
        label={label}
        top="-2px"
        left="-2px"
        borderBottomRightRadius="xl"
        borderTopLeftRadius="2xl"
      />
    )}
  </ColorCard>
)

export default RewardCard
