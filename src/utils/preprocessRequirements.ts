import { Requirement, RequirementFormField } from "types"

const preprocessRequirements = (requirements: Array<Requirement>) => {
  if (!requirements || !Array.isArray(requirements)) return undefined

  // see the comment in Requirements.tsx at line 33
  return requirements
    .filter((requirement) => (requirement as RequirementFormField).active)
    .map((requirement) => {
      const mappedRequirement = {} as Requirement

      for (const [key, value] of Object.entries(requirement)) {
        // Mapping "interval" field to "value" prop
        if (
          requirement.type === "ERC721" &&
          key === "interval" &&
          Array.isArray(value) &&
          value.length === 2
        ) {
          mappedRequirement.value = value
        }

        // Mapping amount field to value prop (NftFormCard)
        if (
          requirement.type === "ERC721" &&
          !requirement.value &&
          key === "amount" &&
          value
        ) {
          mappedRequirement.value = value
        }

        // Mapping "strategyParams" field to "value" prop
        if (requirement.type === "SNAPSHOT" && key === "strategyParams" && value) {
          mappedRequirement.value = value
        }

        if (!["active", "interval", "strategyParams"].includes(key))
          mappedRequirement[key] = value
      }

      return mappedRequirement
    })
}

export default preprocessRequirements
