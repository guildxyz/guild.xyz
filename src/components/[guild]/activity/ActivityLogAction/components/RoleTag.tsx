import {
  Circle,
  HStack,
  Img,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { useActivityLog } from "../../ActivityLogContext"

type Props = {
  id: number
  guildId: number
}

const RoleTag = ({ id, guildId }: Props): JSX.Element => {
  const { baseUrl, data } = useActivityLog()
  const colorScheme = useColorModeValue("alpha", "blackalpha")

  const { roles } = useGuild(guildId)
  const guildRole = roles?.find((role) => role.id === id)
  const activityLogRole = data.values.roles.find((role) => role.id === id)

  const roleName = guildRole?.name ?? activityLogRole?.name ?? "Unknown role"
  const roleImageUrl = guildRole?.imageUrl
  const imgBgColor = useColorModeValue("gray.700", "gray.600")

  const router = useRouter()

  return (
    <Tooltip label="Filter by role" isDisabled={!id} placement="top" hasArrow>
      <Tag
        as="button"
        colorScheme={colorScheme}
        minW="max-content"
        h="max-content"
        onClick={
          id
            ? () => {
                router.push({
                  pathname: baseUrl,
                  query: { ...router.query, roleId: id },
                })
              }
            : undefined
        }
      >
        {!roleName ? (
          "Unknown role"
        ) : (
          <HStack spacing={1}>
            {roleImageUrl && (
              <Circle bgColor={imgBgColor} size={4}>
                <Img
                  boxSize={roleImageUrl?.startsWith("/guildLogos") ? 2.5 : 4}
                  borderRadius={!roleImageUrl?.startsWith("/guildLogos") && "full"}
                  src={roleImageUrl}
                  alt={roleName}
                />
              </Circle>
            )}
            <Text as="span" w="max-content">
              {roleName ?? "Unknown role"}
            </Text>
          </HStack>
        )}
      </Tag>
    </Tooltip>
  )
}

export default RoleTag
