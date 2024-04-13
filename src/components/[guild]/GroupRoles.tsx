import { Center, Spinner, Stack } from "@chakra-ui/react"
import CollapsibleRoleSection from "components/[guild]/CollapsibleRoleSection"
import { RequirementErrorConfigProvider } from "components/[guild]/Requirements/RequirementErrorConfigContext"
import RoleCard from "components/[guild]/RoleCard/RoleCard"
import useGuild from "components/[guild]/hooks/useGuild"
import useRoleGroup from "components/[guild]/hooks/useRoleGroup"
import useScrollEffect from "hooks/useScrollEffect"
import dynamic from "next/dynamic"
import { useMemo, useRef, useState } from "react"
import { Visibility } from "types"
import useGuildPermission from "./hooks/useGuildPermission"

const BATCH_SIZE = 10

const DynamicAddRoleCard = dynamic(
  () => import("components/[guild]/[group]/AddRoleCard")
)
const DynamicNoRolesAlert = dynamic(() => import("components/[guild]/NoRolesAlert"))

const GroupRoles = () => {
  const { roles } = useGuild()
  const { isAdmin } = useGuildPermission()

  const group = useRoleGroup()
  const groupRoles = roles?.filter((role) => role.groupId === group.id)

  // temporary, will order roles already in the SQL query in the future
  const sortedRoles = useMemo(() => {
    if (groupRoles?.every((role) => role.position === null)) {
      const byMembers = groupRoles?.sort(
        (role1, role2) => role2.memberCount - role1.memberCount
      )
      return byMembers
    }

    return (
      groupRoles?.sort((role1, role2) => {
        if (role1.position === null) return 1
        if (role2.position === null) return -1
        return role1.position - role2.position
      }) ?? []
    )
  }, [groupRoles])

  const publicRoles = sortedRoles.filter(
    (role) => role.visibility !== Visibility.HIDDEN
  )
  const hiddenRoles = sortedRoles.filter(
    (role) => role.visibility === Visibility.HIDDEN
  )

  // TODO: we use this behaviour in multiple places now, should make a useScrollBatchedRendering hook
  const [renderedRolesCount, setRenderedRolesCount] = useState(BATCH_SIZE)
  const rolesEl = useRef(null)
  useScrollEffect(() => {
    if (
      !rolesEl.current ||
      rolesEl.current.getBoundingClientRect().bottom > window.innerHeight ||
      groupRoles?.length <= renderedRolesCount
    )
      return

    setRenderedRolesCount((prevValue) => prevValue + BATCH_SIZE)
  }, [groupRoles, renderedRolesCount])

  const renderedRoles = publicRoles?.slice(0, renderedRolesCount) || []

  return (
    <>
      {renderedRoles.length ? (
        <RequirementErrorConfigProvider>
          <Stack ref={rolesEl} spacing={4}>
            {renderedRoles.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </Stack>
        </RequirementErrorConfigProvider>
      ) : isAdmin ? (
        <DynamicAddRoleCard />
      ) : (
        <DynamicNoRolesAlert type="GROUP" />
      )}

      {publicRoles?.length && groupRoles?.length > renderedRolesCount && (
        <Center pt={6}>
          <Spinner />
        </Center>
      )}

      {!!hiddenRoles?.length && (
        <CollapsibleRoleSection
          id="hiddenRoles"
          roleCount={hiddenRoles.length}
          label="hidden"
          defaultIsOpen
        >
          {hiddenRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </CollapsibleRoleSection>
      )}
    </>
  )
}

export default GroupRoles
