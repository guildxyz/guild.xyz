import { Schemas } from "@guildxyz/types"
import useCreateRequirement from "components/create-guild/Requirements/hooks/useCreateRequirement"
import useHandleRequirementState from "components/create-guild/Requirements/hooks/useHandleRequirementState"
import { createContext, ReactNode, useContext } from "react"
import { Requirement, RequirementCreateResponseOutput } from "types"
import useRequirements from "./hooks/useRequirements"

const RequirementHandlerContext = createContext<{
  onAddRequirement: (
    requirement: Schemas["RequirementCreationPayload"]
  ) => RequirementCreateResponseOutput | Promise<RequirementCreateResponseOutput>
  requirements: Requirement[]
  requirementsLoading?: boolean
  addRequirementLoading?: boolean
}>(undefined)

const useRequirementHandlerContext = () => useContext(RequirementHandlerContext)

const ClientStateRequirementHandlerProvider = ({
  methods,
  children,
}: {
  methods: any
  children: ReactNode
}) => {
  const { requirements, append } = useHandleRequirementState(methods)

  return (
    <RequirementHandlerContext.Provider
      value={{
        onAddRequirement: append,
        requirements: requirements as Requirement[],
      }}
    >
      {children}
    </RequirementHandlerContext.Provider>
  )
}

const ApiRequirementHandlerProvider = ({
  roleId,
  children,
}: {
  roleId: number
  children: ReactNode
}) => {
  const {
    data,
    mutate,
    isValidating,
    isLoading: reqsLoading,
  } = useRequirements(roleId)

  const requirements = data || []

  const { onSubmit, isLoading } = useCreateRequirement(roleId, {
    onSuccess: () => {
      mutate()
    },
    onError: () => {},
  })

  return (
    <RequirementHandlerContext.Provider
      value={{
        onAddRequirement: onSubmit,
        requirements,
        requirementsLoading: reqsLoading || isValidating,
        addRequirementLoading: isLoading,
      }}
    >
      {children}
    </RequirementHandlerContext.Provider>
  )
}

export {
  ApiRequirementHandlerProvider,
  ClientStateRequirementHandlerProvider,
  RequirementHandlerContext,
  useRequirementHandlerContext,
}
