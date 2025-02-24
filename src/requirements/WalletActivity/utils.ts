import { AbiFunction } from "viem"

export const abiItemToFunctionSignature = (
  item: AbiFunction,
  mode: "PARAM_TYPES" | "PARAM_NAMES" = "PARAM_TYPES"
) => {
  if (mode === "PARAM_NAMES")
    return `${item.name}(${item.inputs.map((input) => `${input.name ? `${input.name} ` : ""}${input.type}`).join(", ")})`

  return `${item.name}(${item.inputs.map((input) => input.type).join(", ")})`
}
