import { schemas } from "@guildxyz/types"
import { PropsWithChildren, createContext, useContext } from "react"
import { RequirementType } from "requirements/types"
import { Requirement } from "types"
import { z } from "zod"

// It's safe to use undefine here as the default value, since we'll always have a default value in RequirementProvider
const RequirementContext = createContext<Requirement>(undefined as never)

type Props = {
  requirement: Requirement
}

const RequirementProvider = ({
  requirement,
  children,
}: PropsWithChildren<Props>) => {
  // Added this for safety, but we shouldn't run into this if statement
  if (!requirement) return null

  return (
    <RequirementContext.Provider value={requirement}>
      {children}
    </RequirementContext.Provider>
  )
}

const useRequirementContext = <T extends RequirementType>() => {
  const requirement = useContext(RequirementContext)
  return requirement as unknown as Extract<
    z.output<typeof schemas.RequirementSchema>,
    { type: T }
  >
}

export { RequirementProvider, useRequirementContext }
