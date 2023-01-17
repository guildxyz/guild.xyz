import { Img } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import shortenHex from "utils/shortenHex"
import Requirement from "../common/Requirement"

type DiscoParamType = {
  credType: string
  credIssuence: "before" | "after"
  credIssuenceDate: string
  credIssuer: string
}

const DiscoRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const param = requirement.data.params as DiscoParamType
  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={<Img src="/requirementLogos/disco.png" />}
      {...rest}
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
