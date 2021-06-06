import type { BigNumberish } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"

const parseBalance = (
  balance: BigNumberish,
  decimals = 18,
  decimalsToDisplay = 3
): string => Number(formatUnits(balance, decimals)).toFixed(decimalsToDisplay)

export default parseBalance
