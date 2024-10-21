import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { useAccount, useProvider, useWallet } from "@fuels/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { Contract } from "fuels"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useToastWithShareButtons } from "hooks/useToastWithShareButtons"
import { useState } from "react"
import fetcher from "utils/fetcher"
import { useMintGuildPinContext } from "../../../MintGuildPinContext"
import { ClaimParametersInput, GuildActionInput, abi } from "../GuildPinContract"
import { FUEL_FAKE_CHAIN_ID, FUEL_GUILD_PIN_CONTRACT_ID_0X } from "./constants"
import useFuelGuildPinFee from "./useFuelGuildPinFee"

const signatureToBits = (signature: string) => {
  // Remove the leading "0x"
  const str = signature.slice(2)
  // Then split the signature in 2 equal length strings
  const first = str.slice(0, str.length / 2)
  const second = str.slice(str.length / 2)
  return [`0x${first}`, `0x${second}`]
}

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
        userAddress: account,
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

    const contract = new Contract(FUEL_GUILD_PIN_CONTRACT_ID_0X, abi, wallet)
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

    const { waitForResult } = await contract.functions
      .claim(contractCallParams, { bits: signatureToBits(signature) })
      .callParams({ forward: [fee.toNumber(), provider.getBaseAssetId()] })
      .call()

    await waitForResult()

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
