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
import { useActivityLog } from "../../ActivityLogContext"
import { useActivityLogFilters } from "../../ActivityLogFiltersBar/components/ActivityLogFiltersContext"

type Props = ClickableRoleTagProps & TagProps

const RoleTag = forwardRef<Props, "span">(
  ({ roleId, guildId, ...rest }, ref): JSX.Element => {
    const tagColorScheme = useColorModeValue("alpha", "blackalpha")
    const imgBgColor = useColorModeValue("gray.700", "gray.600")

    const { data } = useActivityLog()

    const { roles } = useGuild(guildId)
    const guildRole = roles?.find((role) => role.id === roleId)
    const activityLogRole = data?.values.roles.find((role) => role.id === roleId)

    const name = activityLogRole?.name ?? guildRole?.name ?? "Unknown role"
    const image = guildRole?.imageUrl

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
  roleId: number
  guildId: number
}

const ClickableRoleTag = ({
  roleId,
  guildId,
}: ClickableRoleTagProps): JSX.Element => {
  const filtersContext = useActivityLogFilters()
  const { activeFilters, addFilter } = filtersContext ?? {}
  const isDisabled =
    !filtersContext ||
    !!activeFilters.find(
      (f) => f.filter === "roleId" && f.value === roleId.toString()
    )

  return (
    <Tooltip label="Filter by role" placement="top" hasArrow isDisabled={isDisabled}>
      <RoleTag
        as="button"
        onClick={
          isDisabled
            ? undefined
            : () => addFilter({ filter: "roleId", value: roleId.toString() })
        }
        roleId={roleId}
        guildId={guildId}
        cursor={isDisabled ? "default" : "pointer"}
      />
    </Tooltip>
  )
}

export default RoleTag
export { ClickableRoleTag }
