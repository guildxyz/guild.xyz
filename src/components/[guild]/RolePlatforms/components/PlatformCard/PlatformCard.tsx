import {
  Box,
  Divider,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import Link from "components/common/Link"
import { platforms } from "components/create-guild/PlatformsGrid/PlatformsGrid"
import Image from "next/image"
import { PropsWithChildren } from "react"
import { PlatformName, Rest } from "types"

const platformBackgroundColor: Partial<Record<PlatformName, string>> = {
  DISCORD: "var(--chakra-colors-DISCORD-500)",
  TELEGRAM: "var(--chakra-colors-TELEGRAM-500)",
  GITHUB: "var(--chakra-colors-GITHUB-500)",
}

const platformTypeLabel = Object.fromEntries(
  Object.entries(platforms).map(([key, { label }]) => [key, label])
)

type Props = {
  type: PlatformName
  imageUrl: string
  name: string
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
  link?: string
} & Rest

const LinkWrapper = ({ link, children }: PropsWithChildren<{ link?: string }>) =>
  link?.length > 0 ? (
    <Link href={link} isExternal>
      {children}
    </Link>
  ) : (
    <>{children}</>
  )

const PlatformCard = ({
  type,
  name,
  imageUrl,
  actionRow,
  cornerButton,
  children,
  link,
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
        {imageUrl.length > 0 ? (
          <Box
            overflow={"hidden"}
            borderRadius="full"
            width={10}
            height={10}
            position="relative"
          >
            <Image src={imageUrl} alt={name} layout="fill" />
          </Box>
        ) : (
          <SkeletonCircle size="10" />
        )}
        <Skeleton isLoaded={!!name}>
          <LinkWrapper link={link}>
            <Text fontWeight={"bold"}>{name || "Loading platform..."}</Text>
          </LinkWrapper>
        </Skeleton>
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
