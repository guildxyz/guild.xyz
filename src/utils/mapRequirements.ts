import { Requirement } from "types"

const mapRequirements = (requirements?: Array<Requirement>) =>
  requirements?.map((requirement) => {
    const newRequirement: Requirement = {
      ...requirement,
      createdAt: undefined,
      updatedAt: undefined,
    }

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

    if (
      newRequirement.type === "CONTRACT" &&
      Array.isArray(requirement.data.params)
    ) {
      newRequirement.data.params = requirement.data.params.map((param) =>
        typeof param === "string"
          ? {
              value: param,
            }
          : param
      )
    }

    // Removind id, roleId, symbol, name, since we don't need those in the form
    // delete newRequirement.id
    delete newRequirement.roleId
    delete newRequirement.symbol
    delete newRequirement.name

    return newRequirement
  })

export default mapRequirements
