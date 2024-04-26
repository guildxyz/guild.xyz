import { useTransactionStatusContext } from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useToastWithTweetButton } from "hooks/useToast"
import { useState } from "react"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import { useFetcherWithSign } from "utils/fetcher"
import { ERC20_CONTRACTS } from "utils/guildCheckout/constants"
import processViemContractError from "utils/processViemContractError"
import { TransactionReceipt, WriteContractParameters } from "viem"
import { usePublicClient, useWalletClient } from "wagmi"
import { Chain } from "wagmiConfig/chains"
import useTokenClaimFee from "./useClaimToken"

type ClaimResponse = {
  args: [number, number, string, number, number, `0x${string}`]
}

type Args = WriteContractParameters<typeof tokenRewardPoolAbi, "claim">["args"]

const useCollectToken = (
  chain: Chain,
  roleId?: number,
  rolePlatformId?: number,
  onSuccess?: () => void
) => {
  const { id: guildId } = useGuild()
  const { setTxHash, setTxError, setTxSuccess } = useTransactionStatusContext() ?? {}

  const { amount } = useTokenClaimFee(chain)

  const [loadingText, setLoadingText] = useState("")

  const fetcherWithSign = useFetcherWithSign()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const collect = async () => {
    setTxError?.(false)
    setTxSuccess?.(false)

    setLoadingText("Verifying signature...")

    const endpoint = `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`

    const args: Args = await fetcherWithSign([
      endpoint,
      {
        method: "POST",
        body: {},
      },
    ]).then((res) => {
      const data: ClaimResponse = res.data
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const [_poolId, _rolePlatformId, _amount, _signedAt, _userId, _signature] =
        data.args
      return [
        BigInt(_poolId),
        BigInt(_rolePlatformId),
        BigInt(_amount),
        BigInt(_signedAt),
        BigInt(_userId),
        _signature,
      ] satisfies Args
    })

    const claimTransactionConfig = {
      abi: tokenRewardPoolAbi,
      address: ERC20_CONTRACTS[chain],
      functionName: "claim",
      args,
      value: amount,
    } as const

    setLoadingText("Claiming tokens...")

    const { request } = await publicClient.simulateContract({
      ...claimTransactionConfig,
      account: walletClient.account,
    })

    if (process.env.NEXT_PUBLIC_MOCK_CONNECTOR) {
      return Promise.resolve({} as TransactionReceipt)
    }

    const hash = await walletClient.writeContract({
      ...request,
      account: walletClient.account,
    })

    setTxHash(hash)

    const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt(
      { hash }
    )

    if (receipt.status !== "success") {
      throw new Error(`Transaction failed. Hash: ${hash}`)
    }

    setTxSuccess(true)

    return receipt
  }

  const tweetToast = useToastWithTweetButton()
  const showErrorToast = useShowErrorToast()

  return {
    ...useSubmit<undefined, TransactionReceipt>(collect, {
      onSuccess: () => {
        setLoadingText("")
        tweetToast({
          title: "Successfully claimed your tokens!",
          tweetText: `Just collected my tokens!`,
        })

        onSuccess?.()
      },
      onError: (err) => {
        setLoadingText("")
        setTxError?.(true)

        const prettyError = err.correlationId
          ? err
          : processViemContractError(err, (errorName) => {
              switch (errorName) {
                case "AccessDenied":
                  return "You have no access to execute this action."
                case "AlreadyClaimed":
                  return "You've already collected these tokens"
                case "AddressEmptyCode":
                  return "The user address is missing. Please try again after logging back in!"
                case "Panic":
                  return "The reward pool does not have enough tokens. The guild admin needs to fund it."
                case "IncorrectSignature":
                case "ECDSAInvalidSignature":
                case "ECDSAInvalidSignatureLength":
                case "ECDSAInvalidSignatureS":
                  return "We couldn't verify your signature. Please try signing in again, and make sure you are using the correct credentials."
                case "ERC1967InvalidImplementation":
                  return "There seems to be an error with the smart contract executing this action. Please contact our support team for further assistance."
                case "ERC1967NonPayable":
                  return "This transaction cannot accept Ether. Please check that you are sending funds from the correct token type."
                case "ExpiredSignature":
                  return "Your signature has expired. Please try signing in again!"
                case "FailedInnerCall":
                  return "Something went wrong with the processing of your request. Please try again later. If the problem persists, contact our support team for help."
                case "FailedToSendEther":
                  return "We were unable to complete your Ether transaction. Please check your balance and network settings, and try again."
                case "IncorrectFee":
                  return "The fee for this transaction is incorrect. Please try again after refreshing the page, or contact our support team for help."
                case "InvalidInitialization":
                  return "An error happened whilst setting up your transaction. If the issue persists, please reach out to our support team for help."
                case "NotInitializing":
                  return "It looks like something isn't set up yet. Please make sure all necessary initial setup steps have been completed before proceeding."
                case "OwnableInvalidOwner":
                case "OwnableUnauthorizedAccount":
                  return "It looks like you are not the owner of the resource that you are trying to access. Please try signing in again!"
                case "PoolDoesNotExist":
                  return "The reward pool that your action tried to use does not exist."
                case "TransferFailed":
                  return "We couldn’t complete your transfer. Please check your connection and ensure all details are correct, and try again."
                case "UUPSUnauthorizedCallContext":
                  return "Your request cannot be processed because it was made in an unauthorized context. Please contact our support team for further assistance."
                case "UUPSUnsupportedProxiableUUID":
                  return "We encountered an issue with the upgrade identifier. Please contact our support team for further assistance."
              }
            })

        showErrorToast(prettyError)
      },
    }),
    loadingText,
  }
}

export default useCollectToken
