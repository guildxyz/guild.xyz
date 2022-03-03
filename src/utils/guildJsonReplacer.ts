import isNumber from "./isNumber"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i
const validAddress = (address: string) =>
  address === "" || ADDRESS_REGEX.test(address)

const replacer = (key, value) => {
  if (value === "null") return undefined

  if (key === "address" && value === "0x0000000000000000000000000000000000000000")
    return undefined
  if (key === "value" && typeof value === "number") return value.toString()

  // Whitelist
  if (key === "value" && Array.isArray(value) && value?.every(validAddress))
    return value.filter((address) => address !== "")

  // TODO: we'll need to rethink how these interval-like attributes work, and the backend will also handle these in a different way in the future!
  if (Array.isArray(value) && value.length === 2 && value.every(isNumber))
    return `[${value[0]},${value[1]}]`

  // Removing unnecessary fields (which aren't used on the backend)
  if (["active", "interval", "amount", "nftRequirementType"].includes(key))
    return undefined

  return value
}

export default replacer
