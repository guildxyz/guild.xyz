import isNumber from "./isNumber"

const replacer = (key, value) => {
  if (key === "address" && value === "COIN") return undefined
  if (key === "initialType") return undefined
  if (key === "value" && typeof value === "number") return value.toString()

  // TODO: we'll need to rethink how these interval-like attributes work, and the backend will also handle these in a different way in the future!
  if (Array.isArray(value) && value.length === 2 && value.every(isNumber))
    return `[${value[0]},${value[1]}]`

  return value
}

export default replacer
