import { HStack, Stack } from "@chakra-ui/react"
import {
  AuditLogActionProvider,
  useAuditLogActionContext,
} from "./AuditLogAction/AuditLogActionContext"
import ActionIcon from "./AuditLogAction/components/ActionIcon"
import ActionLabel from "./AuditLogAction/components/ActionLabel"

const AuditLogChildAction = (): JSX.Element => {
  const { children } = useAuditLogActionContext()

  return (
    <HStack alignItems="start">
      <ActionIcon size={6} />
      <Stack>
        <ActionLabel />

        {children?.map((childAction) => (
          <AuditLogActionProvider key={childAction.id} action={childAction}>
            <AuditLogChildAction />
          </AuditLogActionProvider>
        ))}
      </Stack>
    </HStack>
  )
}

export default AuditLogChildAction
