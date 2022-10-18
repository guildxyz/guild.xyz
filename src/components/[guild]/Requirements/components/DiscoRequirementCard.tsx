import { Img } from "@chakra-ui/react"
import { DiscoParamType, Requirement } from "types"
import shortenHex from "utils/shortenHex"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const DiscoRequirementCard = ({ requirement, ...rest }: Props) => {
  const param = requirement.data.params as DiscoParamType
  return (
    <RequirementCard
      requirement={requirement}
      image={<Img src="/requirementLogos/disco.png" />}
      {...rest}
    >
      {`Have a Disco.xyz `}
      {param.credType ? `${param.credType}` : `account`}
      {param.credIssuence
        ? ` issued ${param.credIssuence} ${new Date(
            param.credIssuenceDate
          ).toLocaleDateString()}`
        : ``}
      {param.credIssuer ? ` from ${shortenHex(param.credIssuer)}` : ``}
    </RequirementCard>
  )
}

export default DiscoRequirementCard
