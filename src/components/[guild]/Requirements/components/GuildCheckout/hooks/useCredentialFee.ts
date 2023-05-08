import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chain, Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import {
  GUILD_CREDENTIAL_CONTRACT,
  NULL_ADDRESS,
} from "utils/guildCheckout/constants"

const fetchFee = async (_: string, chain: Chain): Promise<BigNumber> => {
  if (!GUILD_CREDENTIAL_CONTRACT[chain]) return undefined

  const provider = new JsonRpcProvider(RPC[chain].rpcUrls[0])
  const contract = new Contract(
    GUILD_CREDENTIAL_CONTRACT[chain].address,
    GUILD_CREDENTIAL_CONTRACT[chain].abi,
    provider
  )

  return contract.fee(NULL_ADDRESS)
}

const useCredentialFee = (): {
  credentialFee: BigNumber
  isCredentialFeeLoading: boolean
  credentialFeeError: any
} => {
  const { chainId } = useWeb3React()

  const {
    data: credentialFee,
    isValidating: isCredentialFeeLoading,
    error: credentialFeeError,
  } = useSWRImmutable(["credentialFee", Chains[chainId]], fetchFee)

  return {
    credentialFee,
    isCredentialFeeLoading,
    credentialFeeError,
  }
}

export default useCredentialFee
