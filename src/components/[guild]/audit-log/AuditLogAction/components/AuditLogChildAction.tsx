import { HStack, Stack } from "@chakra-ui/react"
import {
  AuditLogActionProvider,
  useAuditLogActionContext,
} from "../AuditLogActionContext"
import ActionIcon from "./ActionIcon"
import ActionLabel from "./ActionLabel"

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
