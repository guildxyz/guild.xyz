import { Address } from "fuels"

const parseFuelAddress = (bech32?: string): `0x${string}` | undefined => {
  if (!bech32) return undefined
  try {
    return new Address(bech32 as `fuel${string}`).toB256() as `0x${string}`
  } catch {
    return undefined
  }
}

export default parseFuelAddress
