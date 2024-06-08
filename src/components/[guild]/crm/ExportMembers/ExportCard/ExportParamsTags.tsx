import { Tag, TagLeftIcon, Tooltip, Wrap } from "@chakra-ui/react"
import RoleTag from "components/[guild]/RoleTag"
import useGuild from "components/[guild]/hooks/useGuild"
import { SortAscending, SortDescending } from "phosphor-react"
import MagnifyingGlassX from "static/icons/magnifying-glass-x.svg"
import capitalize from "utils/capitalize"
import { ExportData, crmOrderByParams } from "../useExports"

const ExportParamsTags = ({
  logic,
  roleIds,
  search,
  order,
  sortOrder,
}: ExportData["data"]["params"]) => (
  <Wrap spacing={1}>
    {!(Array.isArray(roleIds) && !roleIds.length) && (
      <ExportParamsRolesTag {...{ roleIds, logic }} />
    )}

    {order && (
      <Tooltip
        label={`Contains members sorted by ${
          sortOrder === "desc" ? "descending" : "ascending"
        } ${crmOrderByParams[order]}`}
        hasArrow
      >
        <Tag>
          <TagLeftIcon
            as={sortOrder === "desc" ? SortDescending : SortAscending}
            mr="1.5"
          />
          {capitalize(crmOrderByParams[order])}
        </Tag>
      </Tooltip>
    )}

    {search && (
      <Tooltip
        label={`You've started this export searched for "${search}", but search queries are ignored for now, so it contains all members by other filters set`}
        hasArrow
      >
        <Tag bg="none" borderWidth={"1px"} borderStyle={"dashed"}>
          <TagLeftIcon as={MagnifyingGlassX} mr="1.5" />
          {search}
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
