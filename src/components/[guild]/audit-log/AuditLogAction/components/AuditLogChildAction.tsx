import { HStack, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { PropsWithChildren } from "react"
import { Requirement } from "types"
import { AUDITLOG } from "../../constants"
import {
  AuditLogActionProvider,
  useAuditLogActionContext,
} from "../AuditLogActionContext"
import ActionIcon from "./ActionIcon"
import ActionLabel from "./ActionLabel"
import UpdatedDataGrid from "./UpdatedDataGrid"

const AuditLogChildAction = (): JSX.Element => {
  const { action, data, children } = useAuditLogActionContext()

  return (
    <AuditLogChildActionLayout
      icon={<ActionIcon size={6} />}
      label={<ActionLabel />}
    >
      {[
        AUDITLOG.AddRequirement,
        AUDITLOG.UpdateRequirement,
        AUDITLOG.RemoveRequirement,
      ].includes(action) && (
        <UpdatedDataGrid
          before={
            <RequirementDisplayComponent
              requirement={data as Requirement}
              rightElement={null}
              footer={null}
            />
          }
        />
      )}

      {children?.map((childAction) => (
        <AuditLogActionProvider key={childAction.id} action={childAction}>
          <AuditLogChildAction />
        </AuditLogActionProvider>
      ))}
    </AuditLogChildActionLayout>
  )
}

type AuditLogChildActionLayoutProps = {
  icon?: JSX.Element
  label: JSX.Element | string
  isInline?: boolean
}

const AuditLogChildActionLayout = ({
  icon,
  label,
  isInline,
  children,
}: PropsWithChildren<AuditLogChildActionLayoutProps>): JSX.Element => {
  const showInline = useBreakpointValue({ base: false, md: true })

  return (
    <HStack alignItems="start">
      {icon}
      <Stack w={isInline ? "max-content" : "full"}>
        <HStack>
          {typeof label === "string" ? (
            <Text as="span" fontWeight="semibold">
              {label}
            </Text>
          ) : (
            label
          )}
          {isInline && showInline && children}
        </HStack>

        {isInline ? (showInline ? null : children) : children}
      </Stack>
    </HStack>
  )
}

export default AuditLogChildAction
export { AuditLogChildActionLayout }
