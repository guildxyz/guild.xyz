import { Requirement, RequirementFormField } from "types"

const preprocessRequirements = (requirements: Array<Requirement>) => {
  if (!requirements || !Array.isArray(requirements)) return undefined

  // see the comment in Requirements.tsx at line 33
  return requirements
    .filter((requirement) => (requirement as RequirementFormField).active)
    .map((requirement) => {
      const mappedRequirement = {} as Requirement

      for (const [key, value] of Object.entries(requirement)) {
        if (key === "interval" && Array.isArray(value)) {
          mappedRequirement.value = value
        }
        if (key !== "interval" && key !== "active") mappedRequirement[key] = value
      }

      return mappedRequirement
    })
}

export default preprocessRequirements
