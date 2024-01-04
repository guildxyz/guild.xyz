import { Img } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
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
    <Requirement image={<Img src="/requirementLogos/disco.png" />} {...props}>
      {`Have a Disco.xyz `}
      {param.credType ? `${param.credType} ` : `account `}
      {param.credIssuence ? (
        <>
          {`issued ${param.credIssuence} `}
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
