import { HStack, Text } from "@chakra-ui/react"
import capitalize from "utils/capitalize"
import { AuditLogAction } from "../../constants"
import RoleTag from "../../RoleTag"
import UserTag from "../../UserTag"

type Props = {
  action: AuditLogAction
}

const ActionLabel = ({ action: { actionName, values } }: Props): JSX.Element => {
  const tagElement = values.role ? (
    <RoleTag role={values.role} />
  ) : values.user ? (
    <UserTag address={values.user} />
  ) : null

  return (
    <HStack>
      <Text as="span" fontWeight="semibold">
        {capitalize(actionName)}:
      </Text>
      {tagElement}
    </HStack>
  )
}

export default ActionLabel
