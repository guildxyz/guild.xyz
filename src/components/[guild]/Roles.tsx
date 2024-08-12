import { Center, Spinner, Stack } from "@chakra-ui/react"
import CollapsibleRoleSection from "components/[guild]/CollapsibleRoleSection"
import { RequirementErrorConfigProvider } from "components/[guild]/Requirements/RequirementErrorConfigContext"
import RoleCard from "components/[guild]/RoleCard/RoleCard"
import useGuild from "components/[guild]/hooks/useGuild"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import useGuildPermission from "./hooks/useGuildPermission"
import useRoleGroup from "./hooks/useRoleGroup"

const BATCH_SIZE = 5

const DynamicAddRoleCard = dynamic(
  () => import("components/[guild]/[group]/AddRoleCard")
)
const DynamicNoRolesAlert = dynamic(() => import("components/[guild]/NoRolesAlert"))

const Roles = () => {
  const { roles: allRoles } = useGuild()
  const { isAdmin } = useGuildPermission()

  const group = useRoleGroup()
  const roles = allRoles.filter((role) =>
    !!group ? role.groupId === group.id : !role.groupId
  )

  // temporary, will order roles already in the SQL query in the future
  const sortedRoles = useMemo(() => {
    if (roles?.every((role) => role.position === null)) {
      const byMembers = roles?.sort(
        (role1, role2) => role2.memberCount - role1.memberCount
      )
      return byMembers
    }

    return (
      roles?.sort((role1, role2) => {
        if (role1.position === null) return 1
        if (role2.position === null) return -1
        return role1.position - role2.position
      }) ?? []
    )
  }, [roles])

  const publicRoles = sortedRoles.filter((role) => role.visibility !== "HIDDEN")
  const hiddenRoles = sortedRoles.filter((role) => role.visibility === "HIDDEN")

  const [renderedRolesCount, setRenderedRolesCount] = useState(BATCH_SIZE)
  const rolesEl = useScrollBatchedRendering({
    batchSize: BATCH_SIZE,
    disableRendering: roles?.length <= renderedRolesCount,
    setElementCount: setRenderedRolesCount,
  })

  return (
    <>
      {publicRoles.length ? (
        <RequirementErrorConfigProvider>
          <Stack ref={rolesEl} spacing={4}>
            {publicRoles.map((role, i) => {
              if (i > renderedRolesCount - 1) return null
              return <RoleCard key={role.id} role={role} />
            })}
          </Stack>
        </RequirementErrorConfigProvider>
      ) : !!group && isAdmin ? (
        <DynamicAddRoleCard />
      ) : (
        <DynamicNoRolesAlert />
      )}

      {!!publicRoles?.length && roles?.length > renderedRolesCount && (
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
          mt={2}
        >
          {hiddenRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </CollapsibleRoleSection>
      )}
    </>
  )
}

export default Roles
