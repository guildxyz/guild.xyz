import { Requirement } from "types"

const preprocessRequirements = (requirements: Array<Requirement>) => {
  if (!requirements || !Array.isArray(requirements)) return undefined

  const freeRequirement = requirements.find(
    (requirement) => requirement.type === "FREE"
  )

  if (freeRequirement) return [freeRequirement]

  return (
    requirements
      // Setting unused props to undefined, so we don't send them to the API
      .map((requirement) => {
        const processedRequirement: Requirement = {
          ...requirement,
          data: {
            ...requirement.data,
            validAddresses: undefined,
          },
          nftRequirementType: undefined,
        }

        if (requirement.address === "0x0000000000000000000000000000000000000000")
          processedRequirement.address = undefined

        if (
          (requirement.type === "ERC721" ||
            requirement.type === "ERC1155" ||
            requirement.type === "NOUNS") &&
          requirement.data.attributes &&
          !requirement.data.attributes.length
        ) {
          processedRequirement.data.attributes = undefined
          if (!requirement.data.minAmount) processedRequirement.data.minAmount = 0
        }

        if (
          requirement.type === "ALLOWLIST" &&
          !requirement.data.addresses &&
          !requirement.data.hideAllowlist
        )
          processedRequirement.data.addresses = []

        // Deleting ID here, we don't want to update it, and it might also cause bugs
        delete processedRequirement.id

        return processedRequirement
      })
  )
}

export default preprocessRequirements
