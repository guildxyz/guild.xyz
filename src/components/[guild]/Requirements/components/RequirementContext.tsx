import { createContext, PropsWithChildren, useContext } from "react"
import { Requirement } from "types"

const RequirementContext = createContext<Requirement>({} as Requirement)

type Props = {
  requirement: Requirement
}

const RequirementProvider = ({
  requirement,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <RequirementContext.Provider value={requirement}>
    {children}
  </RequirementContext.Provider>
)

const useRequirementContext = () => useContext(RequirementContext)

export { RequirementProvider, useRequirementContext }
