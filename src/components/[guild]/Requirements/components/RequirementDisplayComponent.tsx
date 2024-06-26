import { Icon } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import DataBlock from "components/common/DataBlock"
import { Question, Warning } from "phosphor-react"
import { PropsWithChildren } from "react"
import { ErrorBoundary } from "react-error-boundary"
import REQUIREMENTS from "requirements"
import { Requirement as RequirementType, Rest } from "types"
import { CHAIN_CONFIG } from "wagmiConfig/chains"
import HiddenRequirementAccessIndicator from "./HiddenRequirementAccessIndicator"
import Requirement from "./Requirement"
import RequirementAccessIndicator from "./RequirementAccessIndicator"
import { RequirementProvider, useRequirementContext } from "./RequirementContext"

type Props = {
  requirement: RequirementType
  rightElement?: JSX.Element
} & Rest

const RequirementDisplayComponent = ({
  requirement,
  rightElement = <RequirementAccessIndicator />,
  ...rest
}: Props) => {
  if (requirement.type === "HIDDEN")
    return (
      <Requirement
        image={<Icon as={Question} boxSize={5} />}
        rightElement={
          <HiddenRequirementAccessIndicator roleId={requirement.roleId} />
        }
      >
        Some secret requirements
      </Requirement>
    )

  const RequirementComponent = REQUIREMENTS[requirement.type]?.displayComponent

  if (!!requirement.chain && !CHAIN_CONFIG[requirement.chain])
    return (
      <Requirement image={<Icon as={Warning} boxSize={5} color="orange.300" />}>
        {`Unsupported requirement chain: `}
        <DataBlock>{requirement.chain}</DataBlock>
      </Requirement>
    )

  if (!RequirementComponent)
    return (
      <Requirement image={<Icon as={Warning} boxSize={5} color="orange.300" />}>
        {`Unsupported requirement type: `}
        <DataBlock>{requirement.type}</DataBlock>
      </Requirement>
    )

  return (
    <RequirementProvider requirement={requirement}>
      <InvalidRequirementErrorBoundary>
        <RequirementComponent
          rightElement={rightElement}
          showViewOriginal={
            requirement.data?.customName || requirement.data?.customImage
          }
          {...rest}
        />
      </InvalidRequirementErrorBoundary>
    </RequirementProvider>
  )
}

export const InvalidRequirementErrorBoundary = ({
  rightElement,
  children,
}: PropsWithChildren<{ rightElement?: JSX.Element }>) => {
  const requirement = useRequirementContext()
  const { captureEvent } = usePostHogContext()

  return (
    <ErrorBoundary
      fallback={
        <Requirement
          image={<Icon as={Warning} boxSize={5} color="orange.300" />}
          rightElement={rightElement}
        >
          {`Invalid requirement: `}
          <DataBlock>{requirement.type}</DataBlock>
        </Requirement>
      }
      onError={(error, info) => {
        captureEvent("ErrorBoundary catched error", {
          requirementType: requirement?.type,
          requirement,
          error,
          info,
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default RequirementDisplayComponent
