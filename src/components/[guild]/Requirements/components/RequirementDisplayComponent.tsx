import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { Warning } from "@phosphor-icons/react/dist/ssr"
import { DataBlock } from "components/common/DataBlock"
import { PropsWithChildren } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { REQUIREMENT_DISPLAY_COMPONENTS } from "requirements/requirementDisplayComponents"
import { Requirement as RequirementType } from "types"
import { CHAIN_CONFIG } from "wagmiConfig/chains"
import { Requirement, RequirementProps } from "./Requirement"
import { RequirementAccessIndicator } from "./RequirementAccessIndicator"
import { RequirementProvider, useRequirementContext } from "./RequirementContext"

interface Props extends RequirementProps {
  requirement: RequirementType
}

export const RequirementWarningIcon = () => (
  <Warning weight="bold" className="size-5 text-warning-subtle-foreground" />
)

const RequirementDisplayComponent = ({
  requirement,
  rightElement = <RequirementAccessIndicator />,
  ...rest
}: Props) => {
  const RequirementComponent = REQUIREMENT_DISPLAY_COMPONENTS[requirement.type]

  if (!!requirement.chain && !CHAIN_CONFIG[requirement.chain])
    return (
      <Requirement image={<RequirementWarningIcon />}>
        {`Unsupported requirement chain: `}
        <DataBlock>{requirement.chain}</DataBlock>
      </Requirement>
    )

  if (!RequirementComponent)
    return (
      <Requirement image={<RequirementWarningIcon />}>
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
        <Requirement image={<RequirementWarningIcon />} rightElement={rightElement}>
          {"Invalid requirement: "}
          <DataBlock>{requirement.type}</DataBlock>
        </Requirement>
      }
      onError={(error, info) => {
        captureEvent("ErrorBoundary caught error", {
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

export { RequirementDisplayComponent }
