import {
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  TagLabel,
  TagProps,
  Text,
  Wrap,
  forwardRef,
  useColorModeValue,
} from "@chakra-ui/react"
import { Visibility } from "types"
import RoleTag from "../RoleTag"
import useGuild from "../hooks/useGuild"
import { CrmRole } from "./CRMTable"

type Props = {
  roles: CrmRole[]
}

const RoleTags = ({ roles }: Props) => {
  const renderedRoles = roles?.slice(0, 3)
  const moreRolesCount = roles?.length - 3
  const moreRoles = moreRolesCount > 0 && roles?.slice(-moreRolesCount)

  const moreRolesTagBorderColor = useColorModeValue("gray-300", "whiteAlpha-300")

  if (!renderedRoles?.length) return <Text>-</Text>

  return (
    <HStack>
      {renderedRoles.map(({ roleId }) => (
        <CrmRoleTag key={roleId} roleId={roleId} />
      ))}
      {moreRolesCount > 0 && (
        <Popover trigger="hover" openDelay={0} closeDelay={0}>
          <PopoverTrigger>
            <Tag
              variant={"outline"}
              color="initial"
              sx={{
                "--badge-color": `var(--chakra-colors-${moreRolesTagBorderColor}) !important`,
              }}
            >
              <TagLabel>{`${moreRolesCount} more roles`}</TagLabel>
            </Tag>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Wrap>
                {moreRoles.map(({ roleId }) => (
                  <CrmRoleTag key={roleId} roleId={roleId} />
                ))}
              </Wrap>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </HStack>
  )
}

type RoleTagProps = {
  roleId: number
  guildId?: number
} & TagProps

export const CrmRoleTag = forwardRef<RoleTagProps, "span">(
  ({ roleId, guildId, ...rest }, ref) => {
    const { roles } = useGuild(guildId)
    const role = roles.find((r) => r.id === roleId)

    if (!role) return null

    return (
      <RoleTag
        name={role.name}
        imageUrl={role.imageUrl}
        isHidden={role.visibility === Visibility.HIDDEN}
        {...rest}
      />
    )
  }
)

export default RoleTags
