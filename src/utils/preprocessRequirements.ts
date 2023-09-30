import { COVALENT_CHAINS } from "requirements/WalletActivity/WalletActivityForm"
import { Requirement, RequirementType } from "types"

const preprocessRequirements = (
  requirements: Array<Partial<Requirement>>
): Requirement[] => {
  console.log("preprocessRequirements")
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

        // Make sure minAmount and maxAmount are in correct order
        if (
          processedRequirement.type?.includes("RELATIVE") &&
          typeof processedRequirement.data?.minAmount === "number" &&
          typeof processedRequirement.data?.maxAmount === "number" &&
          typeof processedRequirement.data?.timestamps?.minAmount === "number" &&
          typeof processedRequirement.data?.timestamps?.maxAmount === "number"
        ) {
          const [tsUpperEnd, tsLowerEnd] = [
            processedRequirement.data.timestamps.minAmount,
            processedRequirement.data.timestamps.maxAmount,
          ].sort((a, b) => a - b)

          const [upperEnd, lowerEnd] = [
            processedRequirement.data.minAmount,
            processedRequirement.data.maxAmount,
          ].sort((a, b) => a - b)

          processedRequirement.data.minAmount = lowerEnd
          processedRequirement.data.maxAmount = upperEnd

          processedRequirement.data.timestamps.minAmount = tsLowerEnd
          processedRequirement.data.timestamps.maxAmount = tsUpperEnd
        }

        if (processedRequirement.type?.startsWith("COVALENT_")) {
          if (!processedRequirement?.data?.timestamps?.minAmount) {
            delete processedRequirement.data.timestamps.minAmount
          }

          if (!processedRequirement?.data?.timestamps?.maxAmount) {
            delete processedRequirement.data.timestamps.maxAmount
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

        console.log("preprocessRequirements:type", requirement.type)
        if (
          /**
           * TODO: we couldn't use the type field here, because `handleSubmitDirty`
           * removes it in most cases, but we should fix this issue and uncomment
           * this line
           */
          // requirement.type === "CONTRACT" &&
          Array.isArray(requirement.data.params)
        ) {
          console.log("preprocessing contract state params", requirement.data.params)
          processedRequirement.data.params = requirement.data.params.map(
            (param) => param.value
          )
        }

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
