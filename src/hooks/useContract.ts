import type { ContractInterface } from "@ethersproject/contracts"
import { Contract } from "@ethersproject/contracts"
import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"

const createContract = async ([_, address, withSigner, account, provider, ABI]) =>
  new Contract(
    address,
    ABI,
    withSigner ? provider.getSigner(account).connectUnchecked() : provider
  )

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const useContract = (
  address: string,
  ABI: ContractInterface,
  withSigner = false
): Contract => {
  const { account, chainId, provider } = useWeb3React<Web3Provider>()

  const shouldFetch = ADDRESS_REGEX.test(address) && account && !!provider

  /**
   * Passing provider in the dependency array is fine, its basically a constant
   * reference, won't mix up the cache keys
   */
  const { data: contract } = useSWRImmutable<Contract>(
    shouldFetch
      ? ["contract", address, withSigner, account, provider, ABI, chainId]
      : null,
    createContract
  )

  return contract
}

export default useContract
