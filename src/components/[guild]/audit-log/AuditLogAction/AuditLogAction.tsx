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
import { AuditLogAction as Action } from "../constants"
import {
  AuditLogActionProvider,
  useAuditLogActionContext,
} from "./AuditLogActionContext"
import ActionIcon from "./components/ActionIcon"
import ActionLabel from "./components/ActionLabel"
import AuditLogChildAction from "./components/AuditLogChildAction"

type Props = {
  action: Action
}

const AuditLogAction = (): JSX.Element => {
  const collapseBgColor = useColorModeValue("gray.50", "blackAlpha.400")
  const { isOpen, onToggle } = useDisclosure()

  const { timestamp, children } = useAuditLogActionContext()

  const shouldRenderCollapse = children?.length > 0

  return (
    <Card>
      <HStack justifyContent="space-between" px={{ base: 5, sm: 6 }} py={7}>
        <HStack spacing={4}>
          <ActionIcon />
          <Stack spacing={0.5}>
            <ActionLabel />
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
              <AuditLogActionProvider key={childAction.id} action={childAction}>
                <AuditLogChildAction />
              </AuditLogActionProvider>
            ))}
          </Stack>
        </Collapse>
      )}
    </Card>
  )
}

const AuditLogActionWrapper = ({ action }: Props): JSX.Element => (
  <AuditLogActionProvider action={action}>
    <AuditLogAction />
  </AuditLogActionProvider>
)

export default AuditLogActionWrapper
