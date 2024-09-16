import {
  isUserRejectedError,
  usePostHogContext,
} from "@/components/Providers/PostHogProvider"
import useUsersGuildPins from "@/hooks/useUsersGuildPins"
import { consts } from "@guildxyz/types"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import { env } from "env"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useToastWithShareButtons } from "hooks/useToastWithShareButtons"
import { useState } from "react"
import guildPinAbi from "static/abis/guildPin"
import { GuildPinMetadata } from "types"
import base64ToObject from "utils/base64ToObject"
import fetcher from "utils/fetcher"
import getEventsFromViemTxReceipt from "utils/getEventsFromViemTxReceipt"
import { isGuildPinSupportedChain } from "utils/guildCheckout/utils"
import processViemContractError from "utils/processViemContractError"
import { TransactionReceipt } from "viem"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { GuildAction, useMintGuildPinContext } from "../MintGuildPinContext"
import { useTransactionStatusContext } from "../components/TransactionStatusContext"
import useGuildPinFee from "./useGuildPinFee"

type MintData = {
  userAddress: `0x${string}`
  guildAction: GuildAction
  userId: number
  guildId: number
  guildName: string
  createdAt: number
  adminTreasury: `0x${string}`
  adminFee: string
  timestamp: number
  cid: string
  chainId: number
  contractAddress: `0x${string}`
  signature: `0x${string}`
}

const useMintGuildPin = () => {
  const { captureEvent } = usePostHogContext()

  const { id, name, urlName } = useGuild()
  const postHogOptions = { guild: urlName }

  const { mutate } = useUsersGuildPins()

  const toastWithShareButtons = useToastWithShareButtons()
  const showErrorToast = useShowErrorToast()

  const { address, chainId, status } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const { pinType, setMintedTokenId } = useMintGuildPinContext()
  const { setTxHash, setTxError, setTxSuccess } = useTransactionStatusContext() ?? {}

  const [loadingText, setLoadingText] = useState<string>("")

  const chain = chainId ? Chains[chainId] : undefined
  const contractAddress = isGuildPinSupportedChain(chain)
    ? consts.PinContractAddresses[chain]
    : "0x"

  const { guildPinFee } = useGuildPinFee()

  const { triggerMembershipUpdate } = useMembershipUpdate()

  const mintGuildPin = async () => {
    setTxError?.(false)
    setTxSuccess?.(false)

    setLoadingText("Uploading metadata")
    const {
      userAddress,
      guildAction,
      userId,
      guildId,
      guildName,
      createdAt,
      adminTreasury,
      adminFee,
      timestamp,
      cid,
      signature,
    }: MintData = await fetcher(`/v2/guilds/${id}/pin`, {
      body: {
        userAddress: address,
        guildId: id,
        guildAction: pinType,
        chainId,
        contractAddress,
      },
    })

    setLoadingText("Check your wallet")
    // params: paytoken address, { receiver address, guildAction uint8, userId uint256, guildId uint256, guildName string, createdAt uint256}, signedAt uint256, cid string, signature bytes

    const contractCallParams = [
      {
        receiver: userAddress,
        guildAction,
        userId: BigInt(userId),
        guildId: BigInt(guildId),
        guildName,
        createdAt: BigInt(createdAt),
      },
      adminTreasury,
      BigInt(adminFee),
      BigInt(timestamp),
      cid,
      signature,
    ] as const

    const { request } = await publicClient.simulateContract({
      abi: guildPinAbi,
      address: contractAddress,
      functionName: "claim",
      args: contractCallParams,
      value: guildPinFee,
      account: walletClient.account,
    })

    const hash = await walletClient.writeContract({
      ...request,
      account: walletClient.account,
    })

    setTxHash?.(hash)

    const receipt: TransactionReceipt = await publicClient.waitForTransactionReceipt(
      { hash }
    )

    if (receipt.status !== "success") {
      throw new Error(`Transaction failed. Hash: ${hash}`)
    }

    const events = getEventsFromViemTxReceipt(guildPinAbi, receipt)

    const transferEvent: {
      eventName: "Transfer"
      args: {
        from: `0x${string}`
        to: `0x${string}`
        tokenId: bigint
      }
    } = events.find((event) => event.eventName === "Transfer")

    let tokenId: number, tokenURI: string
    if (transferEvent) {
      try {
        tokenId = Number(transferEvent.args.tokenId)
        setMintedTokenId(tokenId)
        tokenURI = await publicClient.readContract({
          abi: guildPinAbi,
          address: contractAddress,
          functionName: "tokenURI",
          args: [transferEvent.args.tokenId],
        })
      } catch {}
    }

    captureEvent("Minted Guild Pin (GuildCheckout)", {
      ...postHogOptions,
      $set: {
        mintedReward: true,
        mintedGuildPin: true,
      },
    })

    try {
      const metadata: GuildPinMetadata = base64ToObject<GuildPinMetadata>(tokenURI)

      mutate((prevData) => {
        const newPin = {
          chainId,
          tokenId,
          ...metadata,
          image: metadata.image.replace("ipfs://", env.NEXT_PUBLIC_IPFS_GATEWAY),
        }

        const updatedPins = prevData?.usersPins
          ? [...prevData.usersPins, newPin]
          : [newPin]

        return { ...prevData, usersPins: updatedPins }
      })
    } catch {}

    // TODO: trigger membership update only for a specific role (once Guild Pin will be a real reward)
    triggerMembershipUpdate()

    toastWithShareButtons({
      title: "Successfully minted Guild Pin!",
      shareText: `Just minted my Guild Pin for joining ${name}!\nguild.xyz/${urlName}`,
    })
  }

  return {
    ...useSubmit(mintGuildPin, {
      onError: (error) => {
        setLoadingText("")
        setTxError?.(true)

        const prettyError = error.correlationId
          ? error
          : processViemContractError(error)

        if (isUserRejectedError(prettyError)) {
          captureEvent("$set", {
            cancelledGuildPinMinting: true,
          })
        }

        showErrorToast(prettyError)

        captureEvent("Mint Guild Pin error (GuildCheckout)", {
          ...postHogOptions,
          error: prettyError,
          originalError: error,
          wagmiAccountStatus: status,
        })
      },
      onSuccess: () => {
        setLoadingText("")
        setTxSuccess?.(true)
      },
    }),
    loadingText,
  }
}

export default useMintGuildPin
