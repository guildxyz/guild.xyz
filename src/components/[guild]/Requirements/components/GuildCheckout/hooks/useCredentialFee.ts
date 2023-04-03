import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Chain, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import {
  GUILD_CREDENTIAL_CONTRACT,
  NULL_ADDRESS,
} from "utils/guildCheckout/constants"
import { useMintCredentialContext } from "../MintCredentialContext"

const fetchFee = async (_: string, chain: Chain): Promise<BigNumber> => {
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
  const { credentialChain } = useMintCredentialContext()
  const {
    data: credentialFee,
    isValidating: isCredentialFeeLoading,
    error: credentialFeeError,
  } = useSWRImmutable(["credentialFee", credentialChain], fetchFee)

  return {
    credentialFee,
    isCredentialFeeLoading,
    credentialFeeError,
  }
}

export default useCredentialFee
