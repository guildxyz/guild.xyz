import { Requirement } from "types"

const mapRequirements = (requirements?: Array<Requirement>) =>
  requirements?.map((requirement) => {
    const newRequirement: Requirement = {
      ...requirement,
    }

    if (requirement.type === "COIN")
      requirement.address = "0x0000000000000000000000000000000000000000"

    // Handling NFT requirements (AMOUNT, ATTRIBUTE, CUSTOM_ID)
    if (newRequirement.type === "ERC721" || newRequirement.type === "ERC1155")
      newRequirement.nftRequirementType =
        typeof newRequirement.data?.amount === "number" ? "AMOUNT" : "ATTRIBUTE"

    if (newRequirement.type === "CUSTOM_ID")
      newRequirement.nftRequirementType = "CUSTOM_ID"

    return newRequirement
  })

export default mapRequirements
