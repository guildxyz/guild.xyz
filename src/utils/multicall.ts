import { RPC } from "connectors"
import { setMulticallAddress } from "ethers-multicall"

Object.values(RPC).map(({ chainId, multicallAddress }) => {
  setMulticallAddress(chainId, multicallAddress)
})

export * from "ethers-multicall"
