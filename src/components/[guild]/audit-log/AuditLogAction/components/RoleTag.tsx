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

type Props = {
  data?: Record<string, string>
  roleId?: number
}

const RoleTag = ({ data, roleId }: Props): JSX.Element => {
  const colorScheme = useColorModeValue("alpha", "blackalpha")

  const { roles } = useGuild()
  const role = roles?.find((r) => r.id === roleId)

  const roleName = role?.name ?? data?.name
  const roleImageUrl = role?.imageUrl ?? data?.imageUrl
  const imgBgColor = useColorModeValue("gray.700", "gray.600")

  const router = useRouter()

  return (
    <Tooltip label="Filter by role">
      <Tag
        as="button"
        colorScheme={colorScheme}
        onClick={() => {
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, roleId: "todo" },
          })
        }}
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
            <Text as="span">{roleName}</Text>
          </HStack>
        )}
      </Tag>
    </Tooltip>
  )
}

export default RoleTag
