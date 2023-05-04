import { Text, ToastId, useColorModeValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains } from "connectors"
import useContract from "hooks/useContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import useUsersGuildCredentials from "hooks/useUsersGuildCredentials"
import { TwitterLogo } from "phosphor-react"
import { useRef, useState } from "react"
import fetcher from "utils/fetcher"
import {
  GUILD_CREDENTIAL_CONTRACT,
  NULL_ADDRESS,
} from "utils/guildCheckout/constants"
import { GuildAction, useMintCredentialContext } from "../MintCredentialContext"
import useCredentialFee from "./useCredentialFee"
import useSubmitTransaction from "./useSubmitTransaction"

type MintData = {
  userAddress: string
  guildAction: GuildAction
  guildId: number
  timestamp: number
  cid: string
  signature: string
}

const useMintCredential = () => {
  const { captureEvent } = usePostHogContext()
  const { id, name, urlName } = useGuild()
  const postHogOptions = { guild: urlName }

  const { mutate } = useUsersGuildCredentials()

  const toast = useToast()
  const toastIdRef = useRef<ToastId>()
  const showErrorToast = useShowErrorToast()
  const tweetButtonBackground = useColorModeValue("blackAlpha.100", undefined)

  const { chainId, account } = useWeb3React()
  const { credentialType, setMintedTokenId } = useMintCredentialContext()
  const [loadingText, setLoadingText] = useState<string>("")

  const guildCredentialContract = useContract(
    GUILD_CREDENTIAL_CONTRACT[Chains[chainId]]?.address,
    GUILD_CREDENTIAL_CONTRACT[Chains[chainId]]?.abi,
    true
  )

  const { credentialFee } = useCredentialFee()

  const mintCredential = async () => {
    setLoadingText("Uploading metadata")
    const {
      userAddress,
      guildAction,
      guildId,
      timestamp,
      cid,
      signature,
    }: MintData = await fetcher("/assets/credentials", {
      body: {
        userAddress: account,
        guildId: id,
        guildAction: credentialType,
      },
    })

    setLoadingText("Check your wallet")
    const contractCallParams = [
      NULL_ADDRESS,
      userAddress,
      guildAction,
      guildId,
      timestamp,
      cid,
      signature,
      { value: credentialFee },
    ]

    try {
      await guildCredentialContract.callStatic.claim(...contractCallParams)
    } catch (callstaticError) {
      return Promise.reject(
        callstaticError.errorName ?? callstaticError.reason ?? "Contract error"
      )
    }

    return guildCredentialContract.claim(...contractCallParams)
  }

  return {
    ...useSubmitTransaction<null>(mintCredential, {
      onSuccess: (txReceipt) => {
        setLoadingText("")

        if (txReceipt.status !== 1) {
          showErrorToast("Transaction failed")
          captureEvent("Mint credential error (GuildCheckout)", {
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

        if (transferEvent) {
          try {
            const tokenId = transferEvent.args.tokenId.toNumber()
            setMintedTokenId(tokenId)
          } catch {}
        }

        captureEvent("Minted credential (GuildCheckout)", postHogOptions)

        mutate()
        toastIdRef.current = toast({
          status: "success",
          title: "Successfully minted credential!",
          duration: 8000,
          description: (
            <>
              <Text>Let others know as well by sharing it on Twitter</Text>
              <Button
                as="a"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Just minted my Guild Credential for joining ${name}!\nguild.xyz/${urlName}`
                )}`}
                target="_blank"
                bg={tweetButtonBackground}
                leftIcon={<TwitterLogo weight="fill" />}
                size="sm"
                onClick={() => toast.close(toastIdRef.current)}
                mt={3}
                mb="1"
                borderRadius="lg"
              >
                Share
              </Button>
            </>
          ),
        })
      },
      onError: (error) => {
        showErrorToast(error)
        setLoadingText("")

        captureEvent("Mint credential error (GuildCheckout)", postHogOptions)
        captureEvent("claim pre-call error (GuildCheckout)", {
          ...postHogOptions,
          error,
        })
      },
    }),
    loadingText,
  }
}

export default useMintCredential
