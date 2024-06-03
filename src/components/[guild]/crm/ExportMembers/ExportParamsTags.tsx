import { Tag, TagLeftIcon, Tooltip, Wrap } from "@chakra-ui/react"
import RoleTag from "components/[guild]/RoleTag"
import useGuild from "components/[guild]/hooks/useGuild"
import { MagnifyingGlass, SortAscending, SortDescending } from "phosphor-react"
import capitalize from "utils/capitalize"
import { ExportData, crmOrderByParams } from "./useExports"

const ExportParamsTags = ({
  logic,
  roleIds,
  search,
  order,
  sortOrder,
}: ExportData["data"]["params"]) => (
  <Wrap spacing={1}>
    {search && (
      <Tooltip label={`Contains members searched for "${search}"`} hasArrow>
        <Tag>
          <TagLeftIcon as={MagnifyingGlass} />
          {search}
        </Tag>
      </Tooltip>
    )}

    {roleIds.length > 0 && <ExportParamsRolesTag {...{ roleIds, logic }} />}

    {order && (
      <Tooltip
        label={`Contains members sorted by ${
          sortOrder === "desc" ? "descending" : "ascending"
        } ${crmOrderByParams[order]}`}
        hasArrow
      >
        <Tag>
          <TagLeftIcon as={sortOrder === "desc" ? SortDescending : SortAscending} />
          {capitalize(crmOrderByParams[order])}
        </Tag>
      </Tooltip>
    )}
  </Wrap>
)

const ExportParamsRolesTag = ({ roleIds, logic }) => {
  if (Array.isArray(roleIds))
    return (
      <Tooltip
        label={
          <>
            {`Contains members that have ${
              logic === "all" ? "all of the" : "some of the"
            } following roles: `}
            {roleIds.map((roleId) => (
              <ExportParamsRoleTag key={roleId} roleId={roleId} />
            ))}
          </>
        }
        hasArrow
      >
        <Tag>{`${roleIds.length} roles`}</Tag>
      </Tooltip>
    )

  return (
    <Tooltip
      label={
        <>
          {`Contains members that have the following role: `}
          <ExportParamsRoleTag roleId={roleIds} />
        </>
      }
      hasArrow
    >
      <Tag>1 role</Tag>
    </Tooltip>
  )
}

const ExportParamsRoleTag = ({ roleId }) => {
  const { roles } = useGuild()
  const role = roles.find((r) => r.id === parseInt(roleId))
  if (!role) return null

  return (
    <RoleTag
      name={role.name}
      imageUrl={role.imageUrl}
      mr="0.5"
      // the hidden styling works better in the tooltip
      isHidden
      // cherry picked intentionally, works better here than theme sizes
      minH="22px"
    />
  )
}

export default ExportParamsTags
