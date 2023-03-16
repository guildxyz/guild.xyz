import { createContext, PropsWithChildren, useContext } from "react"
import { AuditLogAction } from "../constants"

const AuditLogActionContext = createContext<AuditLogAction>(undefined)

type Props = {
  action: AuditLogAction
}
const AuditLogActionProvider = ({
  action,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <AuditLogActionContext.Provider value={action}>
    {children}
  </AuditLogActionContext.Provider>
)

const useAuditLogActionContext = () => useContext(AuditLogActionContext)

export { AuditLogActionProvider, useAuditLogActionContext }
