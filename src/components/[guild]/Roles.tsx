import { Center, Spinner, Stack } from "@chakra-ui/react"
import CollapsibleRoleSection from "components/[guild]/CollapsibleRoleSection"
import { RequirementErrorConfigProvider } from "components/[guild]/Requirements/RequirementErrorConfigContext"
import RoleCard from "components/[guild]/RoleCard/RoleCard"
import useGuild from "components/[guild]/hooks/useGuild"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import dynamic from "next/dynamic"
import { useState } from "react"
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
  const roles =
    allRoles?.filter((role) =>
      !!group ? role.groupId === group.id : !role.groupId
    ) ?? []

  const publicRoles = roles.filter((role) => role.visibility !== "HIDDEN")
  const hiddenRoles = roles.filter((role) => role.visibility === "HIDDEN")

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
