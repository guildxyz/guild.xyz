import { Img } from "@chakra-ui/react"
import { RequirementComponentProps } from "types"
import shortenHex from "utils/shortenHex"
import Requirement from "./common/Requirement"

type DiscoParamType = {
  credType: string
  credIssuence: "before" | "after"
  credIssuenceDate: string
  credIssuer: string
}

const DiscoRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const param = requirement.data.params as DiscoParamType
  return (
    <Requirement image={<Img src="/requirementLogos/disco.png" />} {...rest}>
      {`Have a Disco.xyz `}
      {param.credType ? `${param.credType}` : `account`}
      {param.credIssuence
        ? ` issued ${param.credIssuence} ${new Date(
            param.credIssuenceDate
          ).toLocaleDateString()}`
        : ``}
      {param.credIssuer ? ` from ${shortenHex(param.credIssuer)}` : ``}
    </Requirement>
  )
}

export default DiscoRequirement
