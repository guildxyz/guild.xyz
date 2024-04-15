import {
  HStack,
  Icon,
  Image,
  Link,
  MergeWithAs,
  Spinner,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import {
  ArrowSquareOut,
  Chat,
  Heart,
  ShareNetwork,
  WarningCircle,
} from "phosphor-react"
import { PropsWithChildren } from "react"
import FarcasterCastSmall from "./FarcasterCastSmall"

export type FarcasterCastData = {
  hash: string
  username: string
  display_name: string
  profile_pic: string
  text: string
  timestamp: string
  likes: number
  recasts: number
  replies: number
}

const FarcasterCast = ({
  cast,
  loading,
  error,
  size = "md",
}: {
  cast: FarcasterCastData
  loading: boolean
  error: boolean
  size?: string
}) => {
  const bgHover = useColorModeValue("gray.100", "blackAlpha.300")

  const url = `https://warpcast.com/${cast?.username}/${cast?.hash}`
  const prettyDate =
    cast?.timestamp &&
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(cast.timestamp))

  if (size === "sm") {
    return <FarcasterCastSmall cast={cast} error={error} loading={loading} />
  }

  if (loading) {
    return (
      <CastWrapper>
        <Spinner mr={2} size="sm" />
        <Text fontSize="sm">Loading cast...</Text>
      </CastWrapper>
    )
  }

  if (error) {
    return (
      <CastWrapper>
        <Icon as={WarningCircle} />
        <Text fontSize="sm" textAlign="center">
          Failed to load cast!
        </Text>
      </CastWrapper>
    )
  }

  if (!cast) {
    return (
      <CastWrapper>
        <Text fontSize="sm" textAlign="center" opacity={0.6}>
          No cast found
        </Text>
      </CastWrapper>
    )
  }

  return (
    <CastWrapper
      as={Link}
      href={url}
      isExternal
      _hover={{ bg: bgHover, cursor: "pointer", textDecoration: "none" }}
      justifyContent="start"
      spacing={4}
    >
      <Image
        width={7}
        height={7}
        objectFit="cover"
        rounded="full"
        src={cast.profile_pic}
        alt="Profile picture"
      />
      <Stack spacing={0}>
        <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
          {cast.display_name}
        </Text>
        <Text fontSize="xs" opacity={0.6}>
          {prettyDate}
        </Text>
      </Stack>
      <HStack spacing={3} ml="auto">
        <Stat icon={Heart} value={cast.likes} />
        <Stat icon={ShareNetwork} value={cast.recasts} />
        <Stat icon={Chat} value={cast.replies} />
      </HStack>
      <Icon as={ArrowSquareOut} />
    </CastWrapper>
  )
}

const Stat = ({ icon, value }) => (
  <HStack gap={0.5}>
    <Icon as={icon} weight="fill" />
    <Text fontSize="xs" fontWeight="bold">
      {value}
    </Text>
  </HStack>
)

const CastWrapper = ({
  children,
  ...props
}: PropsWithChildren<MergeWithAs<StackProps, any>>) => {
  const bg = useColorModeValue("gray.50", "blackAlpha.200")

  return (
    <HStack
      bg={bg}
      w="full"
      minH="65px"
      borderWidth="1px"
      borderRadius="xl"
      px="4"
      position="relative"
      overflow="hidden"
      justifyContent="center"
      py="3.5"
      display="flex"
      {...props}
    >
      {children}
    </HStack>
  )
}

export default FarcasterCast
