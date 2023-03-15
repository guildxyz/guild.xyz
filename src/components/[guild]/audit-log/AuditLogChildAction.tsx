import { ChakraProps, HStack, Stack, Text } from "@chakra-ui/react"
import capitalize from "utils/capitalize"
import ActionIcon from "./ActionIcon"
import { AuditLogAction } from "./constants"

type Props = {
  action: AuditLogAction
} & ChakraProps

const AuditLogChildAction = ({
  action: { actionName, children },
  ...chakraProps
}: Props): JSX.Element => (
  <HStack alignItems="start" {...chakraProps}>
    <ActionIcon actionName={actionName} size={6} />
    <Stack>
      <Text as="span" fontWeight="semibold">
        {capitalize(actionName)}
      </Text>

      {children?.map((childAction) => (
        <AuditLogChildAction key={childAction.id} action={childAction} />
      ))}
    </Stack>
  </HStack>
)

export default AuditLogChildAction
