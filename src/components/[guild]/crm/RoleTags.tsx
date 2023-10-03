import {
  forwardRef,
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
  useColorModeValue,
  Wrap,
} from "@chakra-ui/react"
import { Visibility } from "types"
import ClickableTagPopover from "../activity/ActivityLogAction/components/ClickableTagPopover"
import ViewRole from "../activity/ActivityLogAction/components/ClickableTagPopover/components/ViewRole"
import useGuild from "../hooks/useGuild"
import RoleTag from "../RoleTag"
import { CrmRole } from "./useMembers"

type Props = {
  roles: CrmRole[]
}

const RoleTags = ({ roles }: Props) => {
  const renderedRoles = roles?.slice(0, 3)
  const moreRolesCount = roles?.length - 3
  const moreRoles = moreRolesCount > 0 && roles?.slice(-moreRolesCount)

  const moreRolesTagBorderColorVar = useColorModeValue("gray-300", "whiteAlpha-300")

  if (!renderedRoles?.length) return <Text>-</Text>

  return (
    <HStack>
      {renderedRoles.map(({ roleId, requirementId }) => (
        <CrmRoleTag key={requirementId ?? roleId} roleId={roleId} />
      ))}
      {moreRolesCount > 0 && (
        <Popover trigger="hover" openDelay={0} closeDelay={0}>
          <PopoverTrigger>
            <Tag
              variant={"outline"}
              color="initial"
              sx={{
                "--badge-color": `var(--chakra-colors-${moreRolesTagBorderColorVar}) !important`,
              }}
            >
              <TagLabel>{`${moreRolesCount} more roles`}</TagLabel>
            </Tag>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Wrap>
                {moreRoles?.slice(0, 15).map(({ roleId, requirementId }) => (
                  <CrmRoleTag key={requirementId ?? roleId} roleId={roleId} />
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
} & TagProps

const CrmRoleTag = forwardRef<RoleTagProps, "span">(({ roleId, ...rest }, ref) => {
  const { roles } = useGuild()
  const role = roles.find((r) => r.id === roleId)

  if (!role) return null

  return (
    <RoleTag
      ref={ref}
      name={role.name}
      imageUrl={role.imageUrl}
      isHidden={role.visibility === Visibility.HIDDEN}
      {...rest}
    />
  )
})

export const ClickableCrmRoleTag = ({ roleId, ...tagProps }: RoleTagProps) => (
  <ClickableTagPopover options={<ViewRole roleId={roleId} page="activity" />}>
    <CrmRoleTag roleId={roleId} {...tagProps} />
  </ClickableTagPopover>
)

export default RoleTags
