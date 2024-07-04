import { useWallet } from "@fuels/react"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useTimeInaccuracy from "hooks/useTimeInaccuracy"
import { fetcherWithSign, fuelFetcherWithSign } from "utils/fetcher"
import { useChainId, usePublicClient, useWalletClient } from "wagmi"

const useFetcherWithSign = () => {
  const { keyPair } = useUserPublic()
  const timeInaccuracy = useTimeInaccuracy()

  const { type, address } = useWeb3ConnectionManager()

  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const { wallet: fuelWallet } = useWallet()

  return (props) => {
    const [resource, { signOptions, ...options }] = props

    return !!signOptions?.address || type === "EVM" // Currently an address override is only done for CWaaS wallets, and those are EVM
      ? fetcherWithSign(
          {
            address,
            chainId: chainId.toString(),
            publicClient,
            walletClient,
            keyPair: keyPair?.keyPair,
            ts: Date.now() + timeInaccuracy,
            ...signOptions,
          },
          resource,
          options
        )
      : fuelFetcherWithSign(
          {
            address,
            wallet: fuelWallet,
            keyPair: keyPair?.keyPair,
            ts: Date.now() + timeInaccuracy,
            ...signOptions,
          },
          resource,
          options
        )
  }
}

export { useFetcherWithSign }
