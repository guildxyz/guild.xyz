import {
  Collapse,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { CaretDown } from "phosphor-react"
import AuditLogChildAction from "../AuditLogChildAction"
import { AuditLogAction as Action } from "../constants"
import ActionIcon from "./components/ActionIcon"
import ActionLabel from "./components/ActionLabel"

type Props = {
  action: Action
}

const AuditLogAction = ({ action }: Props): JSX.Element => {
  const collapseBgColor = useColorModeValue("gray.50", "blackAlpha.400")
  const { isOpen, onToggle } = useDisclosure()

  const { actionName, timestamp, children } = action

  const shouldRenderCollapse = children?.length > 0

  return (
    <Card>
      <HStack justifyContent="space-between" px={{ base: 5, sm: 6 }} py={7}>
        <HStack spacing={4}>
          <ActionIcon actionName={actionName} />
          <Stack spacing={0.5}>
            <ActionLabel action={action} />
            <Text as="span" colorScheme="gray" fontSize="sm">
              {new Date(Number(timestamp)).toLocaleString()}
            </Text>
          </Stack>
        </HStack>

        {shouldRenderCollapse && (
          <IconButton
            aria-label="Show details"
            icon={
              <Icon
                as={CaretDown}
                transform={isOpen && "rotate(-180deg)"}
                transition="transform .3s"
              />
            }
            onClick={onToggle}
            variant="ghost"
            minW={8}
            minH={8}
            boxSize={8}
            borderRadius="full"
          />
        )}
      </HStack>

      {shouldRenderCollapse && (
        <Collapse in={isOpen}>
          <Stack spacing={3} pr={6} pl="4.5rem" py={4} bgColor={collapseBgColor}>
            {children.map((childAction) => (
              <AuditLogChildAction key={childAction.id} action={childAction} />
            ))}
          </Stack>
        </Collapse>
      )}
    </Card>
  )
}

export default AuditLogAction
