import {
  Circle,
  forwardRef,
  HStack,
  Img,
  Tag,
  TagProps,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { useActivityLog } from "../../ActivityLogContext"

type Props = {
  name?: string
  image?: string
} & TagProps

const RoleTag = forwardRef<Props, "span">(
  ({ name, image, ...rest }, ref): JSX.Element => {
    const tagColorScheme = useColorModeValue("alpha", "blackalpha")
    const imgBgColor = useColorModeValue("gray.700", "gray.600")

    return (
      <Tag
        ref={ref}
        colorScheme={tagColorScheme}
        minW="max-content"
        h="max-content"
        {...rest}
      >
        {!name ? (
          "Unknown role"
        ) : (
          <HStack spacing={1}>
            {image && (
              <Circle bgColor={imgBgColor} size={4}>
                <Img
                  boxSize={image?.startsWith("/guildLogos") ? 2.5 : 4}
                  borderRadius={!image?.startsWith("/guildLogos") && "full"}
                  src={image}
                  alt={name}
                />
              </Circle>
            )}
            <Text as="span" w="max-content">
              {name}
            </Text>
          </HStack>
        )}
      </Tag>
    )
  }
)

type ClickableRoleTagProps = {
  id: number
  guildId: number
}

const ClickableRoleTag = ({ id, guildId }: ClickableRoleTagProps): JSX.Element => {
  const { baseUrl, data } = useActivityLog()

  const { roles } = useGuild(guildId)
  const guildRole = roles?.find((role) => role.id === id)
  const activityLogRole = data.values.roles.find((role) => role.id === id)

  const name = activityLogRole?.name ?? guildRole?.name ?? "Unknown role"
  const image = guildRole?.imageUrl

  const router = useRouter()

  return (
    <Tooltip label="Filter by role" isDisabled={!id} placement="top" hasArrow>
      <RoleTag
        as="button"
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
        name={name}
        image={image}
      />
    </Tooltip>
  )
}

export default RoleTag
export { ClickableRoleTag }
