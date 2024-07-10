import { PropsWithChildren, createContext, useContext } from "react"
import { RequirementType } from "requirements/types"

type RequirementErrorConfig = Partial<Record<RequirementType, string>>

const REQ_ERROR_CONFIG: RequirementErrorConfig = {
  GALAXY: "Galxe API error, please try again later",
  // TWITTER: "X API error, please try again later",
}

const RequirementErrorConfigContext = createContext<RequirementErrorConfig>({})

const RequirementErrorConfigProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => (
  <RequirementErrorConfigContext.Provider value={REQ_ERROR_CONFIG}>
    {children}
  </RequirementErrorConfigContext.Provider>
)

const useRequirementErrorConfig = () => useContext(RequirementErrorConfigContext)

export { RequirementErrorConfigProvider, useRequirementErrorConfig }
