import { Requirement } from "types"

const preprocessRequirements = (
  requirements: Array<Partial<Requirement>>
): Requirement[] => {
  if (!requirements || !Array.isArray(requirements)) return undefined

  const freeRequirement = requirements.find(
    (requirement) => requirement.type === "FREE"
  )

  if (freeRequirement) return [freeRequirement as Requirement]

  return (
    requirements
      // Setting unused props to undefined, so we don't send them to the API
      .map((requirement) => {
        const processedRequirement: Requirement = {
          ...requirement,
          data: requirement.data
            ? {
                ...requirement.data,
                validAddresses: undefined,
              }
            : undefined,
          nftRequirementType: undefined,
        } as Requirement

        // Make sure minAmount and maxAmount are in correct order
        if (
          processedRequirement.type?.includes("RELATIVE") &&
          typeof processedRequirement.data?.timestamps?.minAmount === "number" &&
          typeof processedRequirement.data?.timestamps?.maxAmount === "number"
        ) {
          const [upperEnd, lowerEnd] = [
            processedRequirement.data.timestamps.minAmount,
            processedRequirement.data.timestamps.maxAmount,
          ].sort((a, b) => a - b)

          processedRequirement.data.timestamps.minAmount = lowerEnd
          processedRequirement.data.timestamps.maxAmount = upperEnd
        }

        if (requirement.type === "COIN") {
          processedRequirement.address = "0x0000000000000000000000000000000000000000"
        } else if (
          !requirement.address ||
          requirement.address === "0x0000000000000000000000000000000000000000"
        ) {
          processedRequirement.address = undefined
        }

        if (
          (requirement.type === "ERC721" ||
            requirement.type === "ERC1155" ||
            requirement.type === "NOUNS") &&
          requirement.data?.attributes &&
          !requirement.data.attributes.length
        ) {
          processedRequirement.data.attributes = undefined
          if (!requirement.data.minAmount) processedRequirement.data.minAmount = 0
        }

        if (
          (requirement.type === "ERC721" || requirement.type === "ERC1155") &&
          requirement.data?.attributes?.length
        ) {
          processedRequirement.data.attributes = requirement.data.attributes.map(
            (attribute) => ({
              ...attribute,
              minValue: attribute.minValue || undefined,
              maxValue: attribute.maxValue || undefined,
            })
          )
        }

        if (
          (requirement.type === "ERC721" ||
            requirement.type === "ERC1155" ||
            requirement.type === "NOUNS") &&
          !processedRequirement.data
        ) {
          processedRequirement.data = {
            minAmount: 0,
          }
        }

        if (
          requirement.type === "ALLOWLIST" &&
          !requirement.data?.addresses &&
          !requirement.data?.hideAllowlist &&
          !!processedRequirement.data
        ) {
          processedRequirement.data.addresses = []
        }

        if (
          requirement.type === "CONTRACT" &&
          Array.isArray(requirement.data?.params)
        ) {
          processedRequirement.data.params = requirement.data.params.map(
            (param) => param.value
          )
        }

        // temp, we'll need to remove some of these fields once we validate reqs with zod
        delete (processedRequirement as any).requirementId
        delete (processedRequirement as any).logic
        delete (processedRequirement as any).balancyDecimals

        // only used on the frontend
        delete (processedRequirement as any).formFieldId

        return processedRequirement
      })
  )
}

export default preprocessRequirements
