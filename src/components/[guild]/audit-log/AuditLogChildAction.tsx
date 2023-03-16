import { HStack, Stack, Text } from "@chakra-ui/react"
import capitalize from "utils/capitalize"
import {
  AuditLogActionProvider,
  useAuditLogActionContext,
} from "./AuditLogAction/AuditLogActionContext"
import ActionIcon from "./AuditLogAction/components/ActionIcon"

const AuditLogChildAction = (): JSX.Element => {
  const { actionName, children } = useAuditLogActionContext()

  return (
    <HStack alignItems="start">
      <ActionIcon size={6} />
      <Stack>
        <Text as="span" fontWeight="semibold">
          {capitalize(actionName)}
        </Text>

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
