import { schemas } from "@guildxyz/types"
import { PropsWithChildren, createContext, useContext } from "react"
import { Requirement } from "types"
import { z } from "zod"

// It's safe to use undefine here as the default value, since we'll always have a default value in RequirementProvider
const RequirementContext = createContext<Requirement>(undefined)

type Props = {
  requirement: Requirement
}

const RequirementProvider = ({
  requirement,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  // Added this for safety, but we shouldn't run into this if statement
  if (!requirement) return null

  return (
    <RequirementContext.Provider value={requirement}>
      {children}
    </RequirementContext.Provider>
  )
}

type ReqType = z.output<typeof schemas.RequirementSchema>["type"]
const useRequirementContext = <RequirementType extends ReqType>() => {
  const requirement = useContext(RequirementContext)
  return requirement as unknown as Extract<
    z.output<typeof schemas.RequirementSchema>,
    { type: RequirementType }
  >
}

export { RequirementProvider, useRequirementContext }
