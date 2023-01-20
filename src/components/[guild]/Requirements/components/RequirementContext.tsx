import { createContext, PropsWithChildren, useContext } from "react"
import { Requirement } from "types"

// It's safe to use undefine here as the default value, since we'll always have a default value in RequirementProvider
const RequirementContext = createContext<Requirement>(undefined)

type Props = {
  requirement: Requirement
}

const RequirementProvider = ({
  requirement,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  // Added this for safety, but we sholdn't run into this if statement
  if (!requirement) return null

  return (
    <RequirementContext.Provider value={requirement}>
      {children}
    </RequirementContext.Provider>
  )
}

const useRequirementContext = () => useContext(RequirementContext)

export { RequirementProvider, useRequirementContext }
