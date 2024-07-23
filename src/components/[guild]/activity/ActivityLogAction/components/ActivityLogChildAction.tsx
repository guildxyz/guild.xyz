import { Center, HStack, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { PropsWithChildren } from "react"
import { Requirement } from "types"
import { ACTION } from "../../constants"
import {
  ActivityLogActionProvider,
  useActivityLogActionContext,
} from "../ActivityLogActionContext"
import ActionIcon from "./ActionIcon"
import ActionLabel from "./ActionLabel"
import UpdatedDataGrid from "./UpdatedDataGrid"

const ActivityLogChildAction = (): JSX.Element => {
  const { action, data, children } = useActivityLogActionContext()

  return (
    <ActivityLogChildActionLayout
      icon={<ActionIcon size={5} />}
      label={<ActionLabel />}
    >
      {[
        ACTION.AddRequirement,
        ACTION.UpdateRequirement,
        ACTION.RemoveRequirement,
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

      {children?.map((childAction) => {
        /**
         * We don't want to display "send reward" actions to the user, so we just render its children here
         */
        if (childAction.action === ACTION.SendReward)
          return childAction.children?.map((ca) => (
            <ActivityLogActionProvider key={ca.id} action={ca}>
              <ActivityLogChildAction />
            </ActivityLogActionProvider>
          ))

        return (
          <ActivityLogActionProvider key={childAction.id} action={childAction}>
            <ActivityLogChildAction />
          </ActivityLogActionProvider>
        )
      })}
    </ActivityLogChildActionLayout>
  )
}

type ActivityLogChildActionLayoutProps = {
  icon?: JSX.Element
  label: JSX.Element | string
  isInline?: boolean
}

const ActivityLogChildActionLayout = ({
  icon,
  label,
  isInline,
  children,
}: PropsWithChildren<ActivityLogChildActionLayoutProps>): JSX.Element => {
  const showInline = useBreakpointValue({ base: false, md: true })

  return (
    <HStack alignItems="start">
      <Center boxSize={6}>{icon}</Center>
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

export default ActivityLogChildAction
export { ActivityLogChildActionLayout }
