import { createContext, PropsWithChildren, useContext } from "react"
import { RequirementType } from "requirements"

type RequirementErrorConfig = Partial<Record<RequirementType, string>>

const REQ_ERROR_CONFIG: RequirementErrorConfig = {
  GALAXY: "Galxe API error, please try again later",
  TWITTER: "Twitter API error, please try again later",
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
