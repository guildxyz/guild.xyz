import { Requirement } from "types"

const mapRequirement = (requirement?: Requirement) => {
  // Using structuredClone so we don't modify the original requirement unintentionally
  const newRequirement: Requirement = structuredClone(requirement)

  if (requirement.type === "COIN")
    newRequirement.address = "0x0000000000000000000000000000000000000000"

  // Handling NFT requirements (AMOUNT, ATTRIBUTE, CUSTOM_ID)
  if (
    newRequirement.type === "ERC721" ||
    newRequirement.type === "ERC1155" ||
    newRequirement.type === "NOUNS"
  )
    newRequirement.nftRequirementType = newRequirement.data?.attributes?.length
      ? "ATTRIBUTE"
      : typeof newRequirement?.data?.id === "string"
        ? "CUSTOM_ID"
        : "AMOUNT"

  if (newRequirement.type === "CONTRACT" && Array.isArray(requirement.data.params)) {
    newRequirement.data.params = requirement.data.params.map((param) =>
      typeof param === "string"
        ? {
            value: param,
          }
        : param,
    )
  }

  // Removing attributes which we don't need inside the form
  delete newRequirement.createdAt
  delete newRequirement.updatedAt
  delete newRequirement.symbol
  delete newRequirement.name

  return newRequirement
}

export default mapRequirement
