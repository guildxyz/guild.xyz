import { createContext, PropsWithChildren, useContext } from "react"
import { ActivityLogAction } from "../constants"

// @ts-expect-error TODO: fix this error originating from strictNullChecks
const ActivityLogActionContext = createContext<ActivityLogAction>(undefined)

type Props = {
  action: ActivityLogAction
}
const ActivityLogActionProvider = ({
  action,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <ActivityLogActionContext.Provider value={action}>
    {children}
  </ActivityLogActionContext.Provider>
)

const useActivityLogActionContext = () => useContext(ActivityLogActionContext)

export { ActivityLogActionProvider, useActivityLogActionContext }
