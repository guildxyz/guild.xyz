import { Img } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import shortenHex from "utils/shortenHex"

type DiscoParamType = {
  credType: string
  credIssuence: "before" | "after"
  credIssuenceDate: string
  credIssuer: string
}

const DiscoRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const param = requirement.data.params as DiscoParamType

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={<Img src="/requirementLogos/disco.png" />}
      {...props}
    >
      {`Have a Disco.xyz `}
      {param.credType ? `${param.credType} ` : `account `}
      {param.credIssuence ? (
        <>
          {"issued "}
          <DataBlock>
            {new Date(param.credIssuenceDate).toLocaleDateString()}
          </DataBlock>
        </>
      ) : (
        ""
      )}
      {param.credIssuer ? (
        <>
          {"from "}
          <DataBlock>{shortenHex(param.credIssuer)}</DataBlock>
        </>
      ) : (
        ""
      )}
    </Requirement>
  )
}

export default DiscoRequirement
