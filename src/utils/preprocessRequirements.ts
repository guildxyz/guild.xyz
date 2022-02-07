import { Requirement, RequirementFormField } from "types"

const preprocessRequirements = (requirements: Array<Requirement>) => {
  if (!requirements || !Array.isArray(requirements)) return undefined

  // see the comment in Requirements.tsx at line 33
  return requirements
    .filter((requirement) => (requirement as RequirementFormField).active)
    .map((requirement) => {
      const mappedRequirement = {} as Requirement

      for (const [key, value] of Object.entries(requirement)) {
        if (
          requirement.type === "ERC721" &&
          !requirement.value &&
          key === "interval" &&
          Array.isArray(value) &&
          value.length === 2
        ) {
          // Mapping "interval" field to "value" prop
          mappedRequirement.value = value
        } else if (
          requirement.type === "ERC721" &&
          !mappedRequirement.value &&
          key === "amount" &&
          value
        ) {
          // Mapping amount field to value prop (NftFormCard)
          mappedRequirement.value = value
        } else if (
          requirement.type === "SNAPSHOT" &&
          key === "strategyParams" &&
          value
        ) {
          // Mapping "strategyParams" field to "value" prop
          mappedRequirement.value = value
        } else if (key === "value" && !mappedRequirement.value) {
          // If we couldn't find any field that should be mapped to "value", use the original "value" field
          mappedRequirement.value = value
        } else if (value) {
          mappedRequirement[key] = value
        }
      }

      return mappedRequirement
    })
}

export default preprocessRequirements
