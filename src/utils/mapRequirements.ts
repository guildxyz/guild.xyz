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

    // Handling different cases on the NftFormCard
    if (
      Array.isArray(parsedValue) &&
      parsedValue?.length === 2 &&
      parsedValue?.every(isNumber)
    ) {
      newRequirement.interval = parsedValue
    } else {
      newRequirement.value = parsedValue
    }

    if (newRequirement.type === "CUSTOM_ID") {
      newRequirement.nftRequirementType = "CUSTOM_ID"
      newRequirement.customId = parsedValue
    }

    if (newRequirement.type === "ERC721") {
      if (!newRequirement.key && !isNaN(parsedValue) && !newRequirement.interval) {
        newRequirement.nftRequirementType = "AMOUNT"
        newRequirement.amount = parsedValue
      } else {
        newRequirement.nftRequirementType = "ATTRIBUTE"
      }
    }

    return newRequirement
  })

export default mapRequirements
