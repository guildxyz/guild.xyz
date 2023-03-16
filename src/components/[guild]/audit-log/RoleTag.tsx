import { Circle, HStack, Img, Tag, Text, useColorModeValue } from "@chakra-ui/react"
import useGuild from "../hooks/useGuild"

type Props = {
  data?: Record<string, string>
  roleId?: number
}

const RoleTag = ({ data, roleId }: Props): JSX.Element => {
  const { roles } = useGuild()
  const role = roles?.find((r) => r.id === roleId)

  const roleName = role?.name ?? data?.name
  const roleImageUrl = role?.imageUrl ?? data?.imageUrl
  const imgBgColor = useColorModeValue("gray.700", "gray.600")

  return (
    <Tag colorScheme="blackalpha">
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
  )
}

export default RoleTag
