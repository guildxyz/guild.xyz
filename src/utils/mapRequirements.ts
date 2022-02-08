import { Requirement, RequirementFormField } from "types"
import isNumber from "./isNumber"
import tryToParse from "./tryToParse"

const mapRequirements = (requirements?: Array<Requirement>) =>
  requirements?.map((requirement) => {
    const newRequirement: RequirementFormField = {
      active: true,
      type: requirement.type,
      chain: requirement.chain,
      address:
        requirement.type === "COIN"
          ? "0x0000000000000000000000000000000000000000"
          : requirement.address,
      key: requirement.key,
    }
    const parsedValue = tryToParse(requirement.value)

    if (
      Array.isArray(parsedValue) &&
      parsedValue?.length === 2 &&
      parsedValue?.every(isNumber)
    ) {
      newRequirement.interval = parsedValue
    } else {
      newRequirement.value = parsedValue
    }

    return newRequirement
  })

export default mapRequirements
