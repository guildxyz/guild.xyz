import { Requirement } from "types"

const preprocessRequirement = (requirement: Partial<Requirement>): Requirement => {
  const processedRequirement: Requirement = structuredClone(
    requirement
  ) as Requirement

  // So we don't send empty strings to the API
  if (
    processedRequirement.type?.startsWith("COVALENT_") &&
    !processedRequirement?.address
  )
    processedRequirement.address = undefined

  // Make sure minAmount and maxAmount are in correct order
  if (
    processedRequirement.type?.includes("RELATIVE") &&
    ((typeof processedRequirement.data?.minAmount === "number" &&
      typeof processedRequirement.data?.maxAmount === "number") ||
      (typeof processedRequirement.data?.timestamps?.minAmount === "number" &&
        typeof processedRequirement.data?.timestamps?.maxAmount === "number"))
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

  if (processedRequirement.type === "COIN") {
    processedRequirement.address = undefined
    if (!processedRequirement.data.minAmount) {
      processedRequirement.data.minAmount = 0
    }
  }

  if (
    (processedRequirement.type === "ERC721" ||
      processedRequirement.type === "ERC1155" ||
      processedRequirement.type === "NOUNS") &&
    !processedRequirement.data.attributes?.length &&
    !processedRequirement.data?.ids?.length
  ) {
    processedRequirement.data.attributes = undefined
    if (!requirement.data.minAmount) processedRequirement.data.minAmount = 0
  }

  if (
    (processedRequirement.type === "ERC721" ||
      processedRequirement.type === "ERC1155") &&
    processedRequirement.data?.attributes?.length
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
    (processedRequirement.type === "ERC721" ||
      processedRequirement.type === "ERC1155" ||
      processedRequirement.type === "NOUNS") &&
    !processedRequirement.data
  ) {
    processedRequirement.data = {
      minAmount: 0,
    }
  }

  if (
    processedRequirement.type === "ALLOWLIST" &&
    !processedRequirement.data?.addresses &&
    !processedRequirement.data?.hideAllowlist &&
    !!processedRequirement.data
  ) {
    processedRequirement.data.addresses = []
  }

  if (
    processedRequirement.type === "CONTRACT" &&
    Array.isArray(processedRequirement.data?.params)
  ) {
    processedRequirement.data.params = requirement.data.params.map(
      (param) => param.value
    )
  }

  if (!processedRequirement.address) delete processedRequirement.address

  // temp, we'll need to remove some of these fields once we validate reqs with zod
  delete (processedRequirement as any).requirementId
  delete (processedRequirement as any).logic
  delete (processedRequirement as any).balancyDecimals
  delete (processedRequirement as any).data?.validAddresses

  // only used on the frontend
  delete (processedRequirement as any).formFieldId

  return processedRequirement
}

export default preprocessRequirement
