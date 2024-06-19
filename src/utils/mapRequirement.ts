import { Requirement } from "types"

const mapRequirement = (requirement?: Requirement) => {
  // Using structuredClone so we don't modify the original requirement unintentionally
  const newRequirement = structuredClone(requirement)
  if (!requirement || !newRequirement) return

  if (requirement.type === "COIN")
    newRequirement.address = "0x0000000000000000000000000000000000000000"

  if (
    newRequirement.type === "CONTRACT" &&
    Array.isArray(requirement?.data?.params) &&
    newRequirement.data
  ) {
    newRequirement.data.params = requirement.data.params.map((param) =>
      typeof param === "string"
        ? {
          value: param,
        }
        : param
    )
  }

  if (
    (newRequirement.type === "ERC721" || newRequirement.type === "ERC1155") &&
    !!newRequirement.data?.id &&
    typeof newRequirement.data?.minAmount !== "number"
  ) {
    newRequirement.data.ids = [newRequirement.data.id]
    delete newRequirement.data.id
  }

  // Removing attributes which we don't need inside the form
  delete newRequirement.createdAt
  delete newRequirement.updatedAt

  return newRequirement
}

export default mapRequirement
