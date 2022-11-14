import { Requirement } from "types"

const mapRequirements = (requirements?: Array<Requirement>) =>
  requirements?.map((requirement) => {
    const newRequirement: Requirement = {
      ...requirement,
    }

    if (requirement.type === "COIN")
      newRequirement.address = "0x0000000000000000000000000000000000000000"

    // Handling NFT requirements (AMOUNT, ATTRIBUTE, CUSTOM_ID)
    if (
      newRequirement.type === "ERC721" ||
      newRequirement.type === "ERC1155" ||
      newRequirement.type === "NOUNS"
    )
      newRequirement.nftRequirementType =
        newRequirement.data?.traitTypes?.length ||
        newRequirement.data?.attribute?.trait_type
          ? "ATTRIBUTE"
          : typeof newRequirement?.data?.id === "string"
          ? "CUSTOM_ID"
          : "AMOUNT"

    if (newRequirement.data?.attribute?.trait_type) {
      const convertedTrait = {
        trait_type: newRequirement.data?.attribute?.trait_type,
        interval: newRequirement.data.attribute.interval,
        value: newRequirement.data.attribute.value,
      }

      newRequirement.data.traitTypes = [convertedTrait]
      delete newRequirement.data.attribute
    }

    // Removind id, roleId, symbol, name, since we don't need those in the form
    // delete newRequirement.id
    delete newRequirement.roleId
    delete newRequirement.symbol
    delete newRequirement.name

    return newRequirement
  })

export default mapRequirements
