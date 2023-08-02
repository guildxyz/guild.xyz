import { COVALENT_CHAINS } from "requirements/WalletActivity/WalletActivityForm"
import { Requirement, RequirementType } from "types"

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
          data: requirement.data
            ? {
                ...requirement.data,
                validAddresses: undefined,
              }
            : undefined,
          nftRequirementType: undefined,
        }

        if (
          processedRequirement.type?.startsWith("ALCHEMY_") &&
          COVALENT_CHAINS.has(processedRequirement.chain)
        ) {
          processedRequirement.type = processedRequirement.type.replace(
            "ALCHEMY_",
            "COVALENT_"
          ) as RequirementType

          if (processedRequirement?.data?.timestamps?.minAmount) {
            processedRequirement.data.timestamps.minAmount *= 1000
          }

          if (processedRequirement?.data?.timestamps?.maxAmount) {
            processedRequirement.data.timestamps.maxAmount *= 1000
          }
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
          requirement.data.attributes &&
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
          requirement.type === "ALLOWLIST" &&
          !requirement.data.addresses &&
          !requirement.data.hideAllowlist
        )
          processedRequirement.data.addresses = []

        // needed for POAP requirements, temporary
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
