import {
  Box,
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
import BeforeAfterActions from "./components/BeforeAfterActions"
import MoreActions from "./components/MoreActions"

type Props = {
  action: Action
}

const DISPLAYED_CHILD_ACTIONS = 5

const AuditLogAction = (): JSX.Element => {
  const groupHoverBgColor = useColorModeValue("gray.50", "whiteAlpha.100")
  const collapseBgColor = useColorModeValue("gray.50", "blackAlpha.400")

  const { isOpen, onToggle } = useDisclosure()

  const { timestamp, children, before, data } = useAuditLogActionContext()

  const shouldRenderCollapse =
    children?.length > 0 ||
    (Object.keys(before ?? {}).length > 0 &&
      Object.entries(before).some(([key, value]) => data[key] !== value))

  return (
    <Card>
      <Box role="group" position="relative">
        <Box
          position="absolute"
          inset={0}
          cursor={shouldRenderCollapse ? "pointer" : "default"}
          onClick={onToggle}
          bgColor="transparent"
          transition="background .2s"
          _groupHover={{
            bgColor: shouldRenderCollapse ? groupHoverBgColor : "transparent",
          }}
        />
        <HStack
          position="relative"
          justifyContent="space-between"
          px={{ base: 5, sm: 6 }}
          py={7}
          pointerEvents="none"
        >
          <HStack spacing={4} pointerEvents="all">
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
              pointerEvents="all"
            />
          )}
        </HStack>
      </Box>

      {shouldRenderCollapse && (
        <Collapse in={isOpen}>
          <Stack spacing={3} pr={6} pl="4.5rem" py={4} bgColor={collapseBgColor}>
            <BeforeAfterActions />
            {children.slice(0, DISPLAYED_CHILD_ACTIONS).map((childAction) => (
              <AuditLogActionProvider key={childAction.id} action={childAction}>
                <AuditLogChildAction />
              </AuditLogActionProvider>
            ))}

            {children.length > DISPLAYED_CHILD_ACTIONS && (
              <MoreActions
                actions={children}
                displayedActionCount={DISPLAYED_CHILD_ACTIONS}
              />
            )}
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
