import {
  HStack,
  Icon,
  Image,
  Link,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { CaretRight, Chat, Heart, ShareNetwork, WarningCircle } from "phosphor-react"
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
  const bg = useColorModeValue("gray.50", "blackAlpha.200")
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
      >
        <Spinner mr={2} size="sm" />
        <Text fontSize="sm">Loading cast...</Text>
      </HStack>
    )
  }

  if (error) {
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
      >
        <Icon as={WarningCircle} />
        <Text fontSize="sm" textAlign="center">
          Failed to load cast!
        </Text>
      </HStack>
    )
  }

  if (!cast) {
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
      >
        <Text fontSize="sm" textAlign="center" opacity={0.6}>
          No cast found
        </Text>
      </HStack>
    )
  }

  return (
    <Link
      href={url}
      isExternal
      bg={bg}
      _hover={{ bg: bgHover, cursor: "pointer" }}
      w="full"
      minH="65px"
      borderWidth="1px"
      borderRadius="xl"
      px="4"
      position="relative"
      overflow="hidden"
      py="3.5"
      display="block"
    >
      <HStack spacing={4}>
        <Image
          width={7}
          height={7}
          objectFit="cover"
          rounded="full"
          src={cast.profile_pic}
          alt="Profile picture"
        />
        <Stack spacing={0}>
          <Text fontWeight="bold" fontSize="sm">
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
        <Icon as={CaretRight} />
      </HStack>
    </Link>
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

export default FarcasterCast
