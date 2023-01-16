import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import Requirement from "../common/Requirement"
import useOtterspaceBadges from "./hooks/useOtterspaceBadges"

const OtterspaceRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps) => {
  const { data, isValidating, error } = useOtterspaceBadges(requirement.chain)
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={badge?.img}
      isImageLoading={isValidating}
      {...rest}
    >
      {`Have the `}
      {!badge || isValidating || error ? (
        <DataBlock
          isLoading={isValidating}
          error={error && "API error, please contact POAP to report."}
        >
          {requirement.data.id}
        </DataBlock>
      ) : (
        badge.label
      )}
      {` Otterspace badge`}
    </Requirement>
  )
}

export default OtterspaceRequirement
