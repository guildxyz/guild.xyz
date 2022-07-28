import {
  Box,
  Divider,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import { platforms } from "components/create-guild/PlatformsGrid/PlatformsGrid"
import Image from "next/image"
import { PropsWithChildren } from "react"
import { PlatformName, Rest } from "types"

const platformBackgroundColor: Partial<Record<PlatformName, string>> = {
  DISCORD: "var(--chakra-colors-DISCORD-500)",
  TELEGRAM: "var(--chakra-colors-TELEGRAM-500)",
  GOOGLE: "var(--chakra-colors-blue-500)",
}

const platformTypeLabel = Object.fromEntries(
  Object.entries(platforms).map(([key, { label }]) => [key, label])
)

type Props = {
  type: PlatformName
  image: string | JSX.Element
  name: string
  info?: string
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
} & Rest

const PlatformCard = ({
  type,
  name,
  info,
  image,
  actionRow,
  cornerButton,
  children,
  ...rest
}: PropsWithChildren<Props>) => (
  <ColorCard
    gridColumn={{ md: actionRow && "span 2" }}
    color={platformBackgroundColor[type]}
    pt={{ base: 10, sm: 11 }}
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
      <HStack spacing={3}>
        {typeof image === "string" ? (
          <>
            {image.length > 0 ? (
              <Box
                overflow={"hidden"}
                borderRadius="full"
                width={10}
                height={10}
                position="relative"
              >
                <Image src={image} alt={name} layout="fill" />
              </Box>
            ) : (
              <SkeletonCircle size="10" />
            )}
          </>
        ) : (
          image
        )}
        <Stack spacing={0}>
          <Skeleton isLoaded={!!name}>
            <Text fontWeight={"bold"}>{name || "Loading platform..."}</Text>
          </Skeleton>
          {info && (
            <Text as="span" color="gray" fontSize="sm">
              {info}
            </Text>
          )}
        </Stack>
      </HStack>
      {actionRow && (
        <>
          <Divider my={3} d={{ md: "none" }} />
          {actionRow}
        </>
      )}
    </Flex>
    {children}
    <ColorCardLabel
      fallbackColor="white"
      type={type}
      typeBackgroundColors={platformBackgroundColor}
      typeLabel={platformTypeLabel}
      top="-px"
      left="-px"
      borderBottomRightRadius="xl"
      borderTopLeftRadius="xl"
    />
  </ColorCard>
)

export default PlatformCard
