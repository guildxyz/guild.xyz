import { Requirement } from "types"
import tryToParse from "./tryToParse"

const mapRequirements = (requirements?: Array<Requirement>) =>
  requirements?.map((requirement) => ({
    active: true,
    type: requirement.type,
    chain: requirement.chain,
    address:
      requirement.type === "COIN"
        ? "0x0000000000000000000000000000000000000000"
        : requirement.address,
    key: requirement.key,
    value: tryToParse(requirement.value),
  }))

export default mapRequirements
