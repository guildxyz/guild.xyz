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
    if (newRequirement.type === "CUSTOM_ID") {
      newRequirement.nftRequirementType = "CUSTOM_ID"
      newRequirement.value = parsedValue
    } else if (
      newRequirement.type === "ERC721" ||
      newRequirement.type === "ERC1155"
    ) {
      if (
        Array.isArray(parsedValue) &&
        parsedValue?.length === 2 &&
        parsedValue?.every(isNumber)
      ) {
        newRequirement.nftRequirementType = "ATTRIBUTE"
        newRequirement.interval = parsedValue
      } else if (
        (!newRequirement.key ||
          parseInt(newRequirement.key).toString() === newRequirement.key) &&
        parsedValue &&
        typeof parseInt(parsedValue) === "number" &&
        !newRequirement.interval
      ) {
        // parseInt(newRequirement.key).toString() === newRequirement.key) - if this is true, we know that this isn't an NFT requirement with traits, but an NFT requirement with index and amount fields
        newRequirement.nftRequirementType = "AMOUNT"
        newRequirement.amount = parsedValue
      } else {
        newRequirement.nftRequirementType = "ATTRIBUTE"
        newRequirement.value = parsedValue
      }
    } else {
      newRequirement.value = parsedValue
    }

    if (
      parsedValue &&
      typeof parsedValue === "object" &&
      !Array.isArray(parsedValue)
    )
      newRequirement.strategyParams = parsedValue

    return newRequirement
  })

export default mapRequirements
