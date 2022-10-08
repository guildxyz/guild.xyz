import { Img } from "@chakra-ui/react"
import { DiscoParamType, Requirement } from "types"
import shortenHex from "utils/shortenHex"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const dateFormat = (date) => {
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  if (day < 10) {
    day = "0" + day
  }
  if (month < 10) {
    month = "0" + month
  }

  return year + "-" + month + "-" + day
}

const DiscoRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Img src="/requirementLogos/disco.png" />}
    //footer={<p>WIP</p>}
  >
    {(requirement.data.params as DiscoParamType).credType
      ? `Have a Disco.xyz ` +
        (requirement.data.params as DiscoParamType).credType +
        ` issued ` +
        (requirement.data.params as DiscoParamType).credIssuence +
        ` ` +
        dateFormat(
          new Date((requirement.data.params as DiscoParamType).credIssuenceDate)
        ) +
        ` from ` +
        shortenHex((requirement.data.params as DiscoParamType).credIssuer) +
        `.`
      : `Have a Disco.xyz account.`}
  </RequirementCard>
)

export default DiscoRequirementCard
