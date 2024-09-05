import {
  isUserRejectedError,
  usePostHogContext,
} from "@/components/Providers/PostHogProvider"
import { useTransactionStatusContext } from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusContext"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useToastWithShareButtons } from "hooks/useToastWithShareButtons"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import guildRewardNftAbi from "static/abis/guildRewardNft"
import legacyGuildRewardNftAbi from "static/abis/legacyGuildRewardNft"
import { PlatformType } from "types"
import processViemContractError from "utils/processViemContractError"
import { TransactionReceipt } from "viem"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import {
  CollectNftForm,
  useCollectNftContext,
} from "../components/CollectNftContext"
import useGuildFee from "./useGuildFee"
import useGuildRewardNftBalanceByUserId from "./useGuildRewardNftBalanceByUserId"
import useTopCollectors from "./useTopCollectors"

// address, userId, signedAt, signature (signedAt isn't used actually)
type LegacyClaimArgs = [`0x${string}`, number, number, `0x${string}`]

// amount, address, userId, signedAt, signature
type ClaimArgs = [number, `0x${string}`, number, number, `0x${string}`]

type ClaimData = {
  // signed value which we need to send in the contract call
  uniqueValue: `0x${string}`
  data: {
    args: LegacyClaimArgs | ClaimArgs
  }
}

const validateDefaultClaimArgs = (args: any[]) => {
  const [userAddress, userId, signedAt, signature] = args
  return (
    userAddress?.startsWith("0x") &&
    typeof userId === "number" &&
    typeof signedAt === "number" &&
    signature?.startsWith("0x")
  )
}

const isLegacyClaimArgs = (
  args: ClaimData["data"]["args"]
): args is LegacyClaimArgs => {
  if (args.length !== 4) return false
  return validateDefaultClaimArgs(args)
}

const isClaimArgs = (args: ClaimData["data"]["args"]): args is ClaimArgs => {
  if (args.length !== 5) return false
  const [amount, ...legacyClaimArgs] = args
  return typeof +amount === "number" && validateDefaultClaimArgs(legacyClaimArgs)
}

const useCollectNft = () => {
  const { captureEvent } = usePostHogContext()
  const { rewardClaimed } = useCustomPosthogEvents()
  const { id: guildId, urlName } = useGuild()
  const postHogOptions = { guild: urlName }

  const toastWithShareButtons = useToastWithShareButtons()
  const showErrorToast = useShowErrorToast()

  const { address: userAddress, chainId, status } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const { chain, nftAddress, roleId, rolePlatformId, guildPlatform } =
    useCollectNftContext()
  const { setTxHash, setTxError, setTxSuccess } = useTransactionStatusContext() ?? {}

  const { guildFee } = useGuildFee(chain)
  const { fee, name, refetch: refetchNftDetails } = useNftDetails(chain, nftAddress)

  const { refetch: refetchBalance } = useGuildRewardNftBalanceByUserId({
    nftAddress,
    chainId: Chains[chain],
  })
  const { mutate: mutateTopCollectors } = useTopCollectors()

  const shouldSwitchChain = chainId !== Chains[chain]

  const [loadingText, setLoadingText] = useState("")
  const fetcherWithSign = useFetcherWithSign()

  const { getValues } = useFormContext<CollectNftForm>()
  const claimAmountFromForm = useWatch<CollectNftForm, "amount">({
    name: "amount",
  })
  const claimAmount = claimAmountFromForm ?? 1

  const mint = async () => {
    setTxError(false)
    setTxSuccess(false)

    if (shouldSwitchChain)
      return Promise.reject("Please switch network before minting")

    setLoadingText("Claiming NFT")

    const { data: claimData }: ClaimData = await fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`,
      {
        body: {
          args:
            guildPlatform?.platformGuildData?.function ===
            ContractCallFunction.DEPRECATED_SIMPLE_CLAIM
              ? []
              : [claimAmount],
        },
      },
    ])

    const claimFee =
      typeof guildFee === "bigint" && typeof fee === "bigint"
        ? (guildFee + fee) * BigInt(claimAmount)
        : BigInt(0)

    let request

    if (isLegacyClaimArgs(claimData.args)) {
      const [address, userId, , signature] = claimData.args
      const { request: legacyClaimRequest } = await publicClient.simulateContract({
        abi: legacyGuildRewardNftAbi,
        address: nftAddress,
        functionName: "claim",
        args: [address, BigInt(userId), signature],
        value: claimFee,
      })
      request = legacyClaimRequest
    }

    if (isClaimArgs(claimData.args)) {
      const [amount, address, userId, signedAt, signature] = claimData.args
      const { request: newClaimRequest } = await publicClient.simulateContract({
        abi: guildRewardNftAbi,
        address: nftAddress,
        functionName: "claim",
        args: [BigInt(amount), address, BigInt(userId), BigInt(signedAt), signature],
        value: claimFee,
      })
      request = newClaimRequest
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

  return {
    ...useSubmit<undefined, TransactionReceipt>(mint, {
      onSuccess: () => {
        rewardClaimed(PlatformType.CONTRACT_CALL)

        const amount = getValues("amount") ?? 1

        setLoadingText("")

        refetchBalance()
        refetchNftDetails()

        mutateTopCollectors(
          (prevValue) => {
            const lowerCaseUserAddress = userAddress.toLowerCase()
            const alreadyCollected = !!prevValue?.topCollectors?.find(
              (collector) => collector.address.toLowerCase() === lowerCaseUserAddress
            )

            if (alreadyCollected) {
              return {
                topCollectors: prevValue.topCollectors
                  .map((collector) => {
                    if (collector.address.toLowerCase() === lowerCaseUserAddress) {
                      return {
                        address: lowerCaseUserAddress,
                        balance: collector.balance + Number(amount),
                      }
                    }

                    return collector
                  })
                  .sort((a, b) => b.balance - a.balance),
                uniqueCollectors: prevValue.uniqueCollectors,
              }
            }

            return {
              topCollectors: [
                ...(prevValue?.topCollectors ?? []),
                {
                  address: userAddress.toLowerCase(),
                  balance: Number(amount),
                },
              ].sort((a, b) => b.balance - a.balance),
              uniqueCollectors: (prevValue?.uniqueCollectors ?? 0) + 1,
            }
          },
          {
            revalidate: false,
          }
        )

        captureEvent("Minted NFT (GuildCheckout)", postHogOptions)

        toastWithShareButtons({
          title: `Successfully collected ${amount > 1 ? `${amount} ` : ""}NFT${
            amount > 1 ? "s" : ""
          }!`,
          shareText: `Just collected my ${name} NFT${
            amount > 1 ? "s" : ""
          }!\nguild.xyz/${urlName}/collect/${chain.toLowerCase()}/${nftAddress.toLowerCase()}`,
        })
      },
      onError: (error) => {
        setLoadingText("")
        setTxError(true)

        const prettyError = error.correlationId
          ? error
          : processViemContractError(error, (errorName) => {
              if (errorName === "AlreadyClaimed")
                return "You've already collected this NFT"
            })

        if (isUserRejectedError(prettyError)) {
          captureEvent("$set", {
            cancelledNftMinting: true,
          })
        }

        showErrorToast(prettyError)

        captureEvent("Mint NFT error (GuildCheckout)", {
          ...postHogOptions,
          error: prettyError,
          originalError: error,
          wagmiAccountStatus: status,
        })
      },
    }),
    loadingText,
  }
}

export default useCollectNft
