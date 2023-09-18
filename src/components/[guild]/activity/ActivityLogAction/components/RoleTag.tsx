import { forwardRef, TagProps } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import RoleTag from "components/[guild]/RoleTag"
import { useActivityLog } from "../../ActivityLogContext"
import ClickableTagPopover from "./ClickableTagPopover"

type Props = ClickableRoleTagProps & TagProps

const ActivityLogRoleTag = forwardRef<Props, any>(
  ({ roleId, guildId, ...rest }, ref): JSX.Element => {
    const { data } = useActivityLog()

    const { roles } = useGuild(guildId)
    const guildRole = roles?.find((role) => role.id === roleId)
    const activityLogRole = data?.values.roles.find((role) => role.id === roleId)

    const name = activityLogRole?.name ?? guildRole?.name ?? "Unknown role"
    const imageUrl = guildRole?.imageUrl

    return <RoleTag ref={ref} name={name} imageUrl={imageUrl} {...rest} />
  }
)

type ClickableRoleTagProps = {
  roleId: number
  guildId: number
}

const ClickableRoleTag = ({
  roleId,
  guildId,
}: ClickableRoleTagProps): JSX.Element => (
  <ClickableTagPopover
    addFilterParam={{
      filter: "roleId",
      value: roleId.toString(),
    }}
    viewInCRMData={{
      param: "roleIds",
      value: roleId.toString(),
    }}
  >
    <ActivityLogRoleTag roleId={roleId} guildId={guildId} cursor="pointer" />
  </ClickableTagPopover>
)

export default ActivityLogRoleTag
export { ClickableRoleTag }
