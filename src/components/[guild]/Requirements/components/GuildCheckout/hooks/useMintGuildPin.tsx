import { Chains } from "chains"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"

import { useToastWithTweetButton } from "hooks/useToast"
import useUsersGuildPins from "hooks/useUsersGuildPins"
import { useState } from "react"
import { GuildPinMetadata } from "types"
import base64ToObject from "utils/base64ToObject"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useAccount, useChainId } from "wagmi"
import { GuildAction, useMintGuildPinContext } from "../MintGuildPinContext"
import useGuildPinFee from "./useGuildPinFee"
import useSubmitTransaction from "./useSubmitTransaction"

type MintData = {
  userAddress: string
  guildAction: GuildAction
  userId: number
  guildId: number
  guildName: string
  createdAt: number
  timestamp: number
  cid: string
  signature: string
}

const useMintGuildPin = () => {
  const { captureEvent } = usePostHogContext()
  const { id, name, urlName, roles } = useGuild()
  const postHogOptions = { guild: urlName }

  const { mutate } = useUsersGuildPins()

  const toastWithTweetButton = useToastWithTweetButton()
  const showErrorToast = useShowErrorToast()

  const { address } = useAccount()
  const chainId = useChainId()
  const { pinType, setMintedTokenId } = useMintGuildPinContext()
  const [loadingText, setLoadingText] = useState<string>("")

  // WAGMI TODO
  // const guildPinContract = useContract(
  //   GUILD_PIN_CONTRACTS[Chains[chainId]]?.address,
  //   GUILD_PIN_CONTRACTS[Chains[chainId]]?.abi,
  //   true
  // )
  const guildPinContract = null

  const { guildPinFee } = useGuildPinFee()

  const mintGuildPin = async () => {
    setLoadingText("Uploading metadata")
    const {
      userAddress,
      guildAction,
      userId,
      guildId,
      guildName,
      createdAt,
      timestamp,
      cid,
      signature,
    }: MintData = await fetcher(`/v2/guilds/${id}/pin`, {
      body: {
        userAddress: address,
        guildId: id,
        guildAction: pinType,
        chainId,
        contractAddress: guildPinContract.address,
      },
    })

    setLoadingText("Check your wallet")
    const contractCallParams = [
      NULL_ADDRESS,
      {
        receiver: userAddress,
        guildAction,
        userId,
        guildId,
        guildName,
        createdAt,
      },
      timestamp,
      cid,
      signature,
      { value: guildPinFee },
    ]

    try {
      await guildPinContract.callStatic.claim(...contractCallParams)
    } catch (callstaticError) {
      return Promise.reject(
        callstaticError.errorName ?? callstaticError.reason ?? "Contract error"
      )
    }

    return guildPinContract.claim(...contractCallParams)
  }

  const fetcherWithSign = useFetcherWithSign()

  return {
    ...useSubmitTransaction<null>(mintGuildPin, {
      onSuccess: async (txReceipt) => {
        setLoadingText("")

        if (txReceipt.status !== 1) {
          showErrorToast("Transaction failed")
          captureEvent("Mint Guild Pin error (GuildCheckout)", {
            ...postHogOptions,
            txReceipt,
          })
          captureEvent("claim error (GuildCheckout)", {
            ...postHogOptions,
            txReceipt,
          })
          return
        }

        const transferEvent = txReceipt.events?.find((e) => e.event === "Transfer")

        let tokenId: number, tokenURI: string

        if (transferEvent) {
          try {
            tokenId = transferEvent.args.tokenId.toNumber()
            setMintedTokenId(tokenId)
            tokenURI = await guildPinContract.tokenURI(tokenId)
          } catch {}
        }

        captureEvent("Minted Guild Pin (GuildCheckout)", postHogOptions)

        try {
          const metadata: GuildPinMetadata =
            base64ToObject<GuildPinMetadata>(tokenURI)

          mutate((prevData) => [
            ...(prevData ?? []),
            {
              chainId,
              tokenId,
              ...metadata,
            },
          ])
        } catch {}

        const hasGuildPinRequirement = roles
          .flatMap((r) => r.requirements)
          .some(
            (req) =>
              req.type === "ERC721" &&
              req.chain === Chains[chainId] &&
              req.address.toLowerCase() === guildPinContract.address.toLowerCase()
          )

        if (hasGuildPinRequirement) {
          fetcherWithSign([`/user/join`, { method: "POST", body: { guildId: id } }])
        }

        toastWithTweetButton({
          title: "Successfully minted Guild Pin!",
          tweetText: `Just minted my Guild Pin for joining ${name}!\nguild.xyz/${urlName}`,
        })
      },
      onError: (error) => {
        showErrorToast(error)
        setLoadingText("")

        captureEvent("Mint Guild Pin error (GuildCheckout)", postHogOptions)
        captureEvent("claim pre-call error (GuildCheckout)", {
          ...postHogOptions,
          error,
        })
      },
    }),
    loadingText,
  }
}

export default useMintGuildPin
