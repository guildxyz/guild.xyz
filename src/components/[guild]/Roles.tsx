import { Center, Spinner, Stack } from "@chakra-ui/react"
import CollapsibleRoleSection from "components/[guild]/CollapsibleRoleSection"
import { RoleCard } from "components/[guild]/RoleCard"
import useGuild from "components/[guild]/hooks/useGuild"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import dynamic from "next/dynamic"
import { useState } from "react"
import { Role } from "types"
import useGuildPermission from "./hooks/useGuildPermission"
import useRoleGroup from "./hooks/useRoleGroup"

const BATCH_SIZE = 5

const DynamicAddRoleCard = dynamic(
  () => import("components/[guild]/[group]/AddRoleCard")
)
const DynamicNoRolesAlert = dynamic(() => import("components/[guild]/NoRolesAlert"))

const getHighlightedRoleId = () => {
  if (typeof window === "undefined") return undefined
  return window.location.hash.startsWith("#role-")
    ? window.location.hash.split("-")[1]
    : undefined
}

/**
 * We have a fake lazy load on  the roles list, so sometimes we can't jump to the role which is defined in window.location.hash, because it is not rendered yet. That's why we move the highlighted role to the first place when we have a role ID in the hash.
 */
const sortHighlightedRoleFirst = (roles: Role[]): Role[] => {
  const highlightedRoleId = getHighlightedRoleId()
  const highlightedRole = roles.find(
    (role) => role.id.toString() === highlightedRoleId
  )

  return highlightedRole
    ? [highlightedRole, ...roles.filter((role) => role.id !== highlightedRole.id)]
    : roles
}

const Roles = () => {
  const { roles: allRoles } = useGuild()
  const { isAdmin } = useGuildPermission()

  const group = useRoleGroup()
  const roles =
    allRoles?.filter((role) =>
      !!group ? role.groupId === group.id : !role.groupId
    ) ?? []

  const publicRoles = sortHighlightedRoleFirst(
    roles.filter((role) => role.visibility !== "HIDDEN")
  )
  const hiddenRoles = sortHighlightedRoleFirst(
    roles.filter((role) => role.visibility === "HIDDEN")
  )

  const [renderedRolesCount, setRenderedRolesCount] = useState(BATCH_SIZE)
  const rolesEl = useScrollBatchedRendering({
    batchSize: BATCH_SIZE,
    disableRendering: publicRoles?.length <= renderedRolesCount,
    setElementCount: setRenderedRolesCount,
  })

  const [renderedHiddenRolesCount, setRenderedHiddenRolesCount] =
    useState(BATCH_SIZE)
  const hiddenRolesEl = useScrollBatchedRendering({
    batchSize: BATCH_SIZE,
    disableRendering: hiddenRoles?.length <= renderedHiddenRolesCount,
    setElementCount: setRenderedHiddenRolesCount,
  })

  return (
    <>
      {publicRoles.length ? (
        <Stack ref={rolesEl} spacing={4}>
          {publicRoles.map((role, i) => {
            if (i > renderedRolesCount - 1) return null
            return <RoleCard key={role.id} role={role} />
          })}
        </Stack>
      ) : !!group && isAdmin ? (
        <DynamicAddRoleCard />
      ) : (
        <DynamicNoRolesAlert />
      )}

      {!!publicRoles?.length && publicRoles?.length > renderedRolesCount && (
        <Center pt={6}>
          <Spinner />
        </Center>
      )}

      {!!hiddenRoles?.length && (
        <CollapsibleRoleSection
          ref={hiddenRolesEl}
          id="hiddenRoles"
          roleCount={hiddenRoles.length}
          label="hidden"
          defaultIsOpen
          mt={2}
        >
          {hiddenRoles.map((role, i) => {
            if (i > renderedHiddenRolesCount - 1) return null
            return <RoleCard key={role.id} role={role} />
          })}
        </CollapsibleRoleSection>
      )}

      {!!hiddenRoles?.length && hiddenRoles.length > renderedHiddenRolesCount && (
        <Center pt={6}>
          <Spinner />
        </Center>
      )}
    </>
  )
}

export default Roles
