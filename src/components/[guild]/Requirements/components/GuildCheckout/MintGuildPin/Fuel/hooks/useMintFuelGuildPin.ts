import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { useAccount, useProvider, useWallet } from "@fuels/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useToastWithShareButtons } from "hooks/useToastWithShareButtons"
import { useState } from "react"
import fetcher from "utils/fetcher"
import parseFuelAddress from "utils/parseFuelAddress"
import { useMintGuildPinContext } from "../../../MintGuildPinContext"
import type { ClaimParametersInput, GuildActionInput } from "../GuildPinContractAbi"
import { GuildPinContractAbi__factory } from "../GuildPinContractAbi_factory"
import { FUEL_FAKE_CHAIN_ID, FUEL_GUILD_PIN_CONTRACT_ID_0X } from "./constants"
import useFuelGuildPinFee from "./useFuelGuildPinFee"

type FuelMintData = {
  userAddress: string
  guildAction: GuildActionInput
  userId: number
  guildId: number
  guildName: string
  createdAt: number
  signedAt: number
  cid: string
  adminTreasury: string
  adminFee: number
  contractAddress: string
  signature: string
}

const useMintFuelGuildPin = () => {
  const { captureEvent } = usePostHogContext()
  const { id, name, urlName } = useGuild()
  const postHogOptions = { guild: urlName }

  const { pinType } = useMintGuildPinContext()

  const { data: fee } = useFuelGuildPinFee()

  const toastWithShareButtons = useToastWithShareButtons()
  const showErrorToast = useShowErrorToast()

  const { provider } = useProvider()
  const { wallet } = useWallet()
  const { account } = useAccount()
  const address = parseFuelAddress(account)

  const [loadingText, setLoadingText] = useState("")

  const mintGuildPin = async () => {
    setLoadingText("Uploading metadata")

    const {
      userAddress,
      guildAction,
      userId,
      guildId,
      guildName,
      createdAt,
      signedAt,
      cid,
      adminTreasury,
      adminFee,
      contractAddress,
      signature,
    }: FuelMintData = await fetcher(`/v2/guilds/${id}/pin`, {
      body: {
        userAddress: address,
        guildId: id,
        guildAction: pinType,
        chainId: FUEL_FAKE_CHAIN_ID,
        contractAddress: FUEL_GUILD_PIN_CONTRACT_ID_0X,
      },
    })

    setLoadingText("Check your wallet")

    // We shouldn't run into these
    if (!provider) throw new Error("Couldn't find Fuel provider")
    if (!wallet) throw new Error("Couldn't find Fuel wallet")
    if (typeof fee === "undefined") throw new Error("Couldn't fetch fee")

    const contract = GuildPinContractAbi__factory.connect(
      FUEL_GUILD_PIN_CONTRACT_ID_0X,
      wallet
    )

    const contractCallParams = {
      recipient: {
        bits: userAddress,
      },
      action: guildAction,
      user_id: userId,
      guild_id: guildId,
      guild_name: guildName.padEnd(64, " "),
      created_at: createdAt,
      signed_at: signedAt,
      chain_id: FUEL_FAKE_CHAIN_ID,
      cid: cid.padEnd(64, " "),
      admin_treasury: {
        ContractId: {
          bits: adminTreasury,
        },
      },
      admin_fee: adminFee,
      contract_id: {
        bits: contractAddress,
      },
    } as const satisfies ClaimParametersInput

    await contract.functions
      .claim(contractCallParams, signature)
      .callParams({ forward: [fee.toNumber(), provider.getBaseAssetId()] })
      .call()

    // We can't fetch users Fuel Pins, since there isn't a method for it in the contract yet
    // const mintedPinId: BN = contractCallRes.logs[0].pin_id
    // const { value: rawMetadata } = await contract.functions
    //   .metadata(mintedPinId)
    //   .simulate()
    //   .catch(() => null)

    // if (rawMetadata) {
    //   try {
    //     const metadata: GuildPinMetadata = JSON.parse(rawMetadata)
    //     mutate((prevData) => [
    //       ...(prevData ?? []),
    //       {
    //         chainId: FUEL_FAKE_CHAIN_ID,
    //         tokenId: mintedPinId.toNumber(),
    //         ...metadata,
    //         image: metadata.image.replace(
    //           "ipfs://",
    //           env.NEXT_PUBLIC_IPFS_GATEWAY
    //         ),
    //       },
    //     ])
    //   } catch {}
    // }

    captureEvent("Minted Fuel Guild Pin (GuildCheckout)", postHogOptions)

    toastWithShareButtons({
      title: "Successfully minted Guild Pin!",
      shareText: `Just minted my Guild Pin for joining ${name}!\nguild.xyz/${urlName}`,
    })
  }

  return {
    ...useSubmit(mintGuildPin, {
      onError: (error) => {
        setLoadingText("")

        const prettyError = error.correlationId ? error : error.message
        showErrorToast(prettyError)

        captureEvent("Mint Fuel Guild Pin error (GuildCheckout)", {
          ...postHogOptions,
          error,
        })
      },
      onSuccess: () => {
        setLoadingText("")
      },
    }),
    loadingText,
  }
}

export default useMintFuelGuildPin
