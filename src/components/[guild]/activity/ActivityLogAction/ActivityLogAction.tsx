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
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { CaretDown } from "phosphor-react"
import { Requirement } from "types"
import { ACTION, ActivityLogAction as Action } from "../constants"
import {
  ActivityLogActionProvider,
  useActivityLogActionContext,
} from "./ActivityLogActionContext"
import ActionIcon from "./components/ActionIcon"
import ActionLabel from "./components/ActionLabel"
import ActivityLogChildAction from "./components/ActivityLogChildAction"
import BeforeAfterActions from "./components/BeforeAfterActions"
import MoreActions from "./components/MoreActions"
import UpdatedDataGrid from "./components/UpdatedDataGrid"

type Props = {
  action: Action
}

const DISPLAYED_CHILD_ACTIONS = 5

const ActivityLogAction = (): JSX.Element => {
  const groupHoverBgColor = useColorModeValue("gray.50", "whiteAlpha.100")
  const collapseBgColor = useColorModeValue("gray.50", "blackAlpha.400")
  const collapseBorder = useColorModeValue("1px", "null")

  const { isOpen, onToggle } = useDisclosure()

  const { action, timestamp, children, before, data } = useActivityLogActionContext()

  const isRequirementRelatedLog = [
    ACTION.AddRequirement,
    ACTION.RemoveRequirement,
  ].includes(action)

  const shouldRenderCollapse =
    children?.length > 0 ||
    (Object.keys(before ?? {}).length > 0 &&
      Object.entries(before).some(([key, value]) => data[key] !== value)) ||
    (isRequirementRelatedLog && Object.entries(data ?? {}).length > 0)

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
            bgColor:
              shouldRenderCollapse && !isOpen ? groupHoverBgColor : "transparent",
          }}
        />
        <HStack
          position="relative"
          justifyContent="space-between"
          px={{ base: 5, sm: 6 }}
          py={6}
          pointerEvents="none"
        >
          <HStack spacing={4} pointerEvents="all">
            <ActionIcon />
            <Stack spacing={{ base: 1.5, sm: 1, md: 0.5 }}>
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
          <Stack
            spacing={3.5}
            pr={6}
            pl={{ base: 5, sm: "4.5rem" }}
            py={4}
            bgColor={collapseBgColor}
            borderTopWidth={collapseBorder}
          >
            {isRequirementRelatedLog && (
              <UpdatedDataGrid
                before={
                  <RequirementDisplayComponent
                    requirement={data as Requirement}
                    rightElement={null}
                  />
                }
              />
            )}
            <BeforeAfterActions />
            {children.slice(0, DISPLAYED_CHILD_ACTIONS).map((childAction) => (
              <ActivityLogActionProvider key={childAction.id} action={childAction}>
                <ActivityLogChildAction />
              </ActivityLogActionProvider>
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

const ActivityLogActionWrapper = ({ action }: Props): JSX.Element => (
  <ActivityLogActionProvider action={action}>
    <ActivityLogAction />
  </ActivityLogActionProvider>
)

export default ActivityLogActionWrapper
