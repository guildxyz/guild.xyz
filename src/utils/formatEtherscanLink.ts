const ETHERSCAN_PREFIXES = {
  1: "",
  3: "ropsten.",
}

const formatEtherscanLink = (
  type: "Account" | "Transaction",
  data: [number, string]
): string => {
  switch (type) {
    case "Account": {
      const [chainId, address] = data
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/address/${address}`
    }
    case "Transaction": {
      const [chainId, hash] = data
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/tx/${hash}`
    }
    default:
      return "This should never happen"
  }
}

export default formatEtherscanLink
