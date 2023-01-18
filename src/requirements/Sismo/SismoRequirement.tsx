import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import Requirement from "../common/Requirement"
import useSismoBadges from "./hooks/useSismoBadges"
import { DEPRECATED_PLAYGROUND_ADDRESS } from "./SismoForm"

const SismoRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { data, isValidating, error } = useSismoBadges(
    requirement.chain,
    requirement.address === DEPRECATED_PLAYGROUND_ADDRESS
  )
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={badge?.img}
      isImageLoading={isValidating}
      withImgBg={false}
      {...rest}
    >
      {`Have the `}
      <DataBlock
        isLoading={isValidating}
        error={error && "API error, please contact Sismo to report."}
      >
        {badge?.label ?? `#${requirement.data.id}`}
      </DataBlock>
      {` Sismo badge${
        requirement.data.type === "PLAYGROUND" ? " (Playground)" : ""
      }`}
    </Requirement>
  )
}

export default SismoRequirement
