import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { Chains } from "connectors"
import useContract from "hooks/useContract"
import pinFileToIPFS from "hooks/usePinata/utils/pinataUpload"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { useState } from "react"
import {
  GUILD_CREDENTIAL_CONTRACT,
  NULL_ADDRESS,
} from "utils/guildCheckout/constants"
import {
  GuildAction,
  GuildCredentialMetadata,
  useMintCredentialContext,
} from "../MintCredentialContext"
import useCredentialFee from "./useCredentialFee"
import useSubmitTransaction from "./useSubmitTransaction"

type PartialMetadata = Pick<
  GuildCredentialMetadata,
  "name" | "description" | "attributes"
>

const uploadFilesToIPFS = async (
  image: File,
  partialMetadata: PartialMetadata
): Promise<string> => {
  if (!partialMetadata) return Promise.reject("Couldn't generate metadata")

  const imageIpfsData = await pinFileToIPFS({
    data: [image],
    fileNames: [image.name],
  })

  const metadata: GuildCredentialMetadata = {
    ...partialMetadata,
    image: `ipfs://${imageIpfsData.IpfsHash}`,
  }

  const metadataJSON = JSON.stringify(metadata)

  const metadataIpfsData = await pinFileToIPFS({
    data: [metadataJSON],
    fileNames: ["metadata.json"],
  })

  return metadataIpfsData.IpfsHash
}

const useMintCredential = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { chainId } = useWeb3React()
  const { id: guildId, name: guildName } = useGuild()
  const { id: userId } = useUser()
  const { credentialType, image } = useMintCredentialContext()
  const [loadingText, setLoadingText] = useState<string>("")

  const partialMetadata: PartialMetadata =
    !guildId || !userId || typeof credentialType !== "number"
      ? undefined
      : {
          name:
            credentialType === GuildAction.IS_OWNER
              ? `Owner of ${guildName}`
              : `Joined ${guildName}`,
          description:
            credentialType === GuildAction.IS_OWNER
              ? `This is an on-chain proof that Guild user #${userId} is the owner of the ${guildName} guild on Guild.xyz.`
              : `This is an on-chain proof that Guild user #${userId} joined the ${guildName} guild on Guild.xyz.`,
          attributes: [
            {
              trait_type: "Type",
              value: GuildAction[credentialType],
            },
            {
              trait_type: "Guild",
              value: guildId.toString(),
            },
            {
              trait_type: "User ID",
              value: userId.toString(),
            },
            {
              trait_type: "Date",
              display_type: "date",
              value: Math.ceil(Date.now() / 1000),
            },
          ],
        }

  const guildCredentialContract = useContract(
    GUILD_CREDENTIAL_CONTRACT[Chains[chainId]]?.address,
    GUILD_CREDENTIAL_CONTRACT[Chains[chainId]]?.abi,
    true
  )

  const { credentialFee } = useCredentialFee()

  const mintCredential = async () => {
    setLoadingText("Uploading metadata")
    const metadataCID = await uploadFilesToIPFS(image, partialMetadata)

    setLoadingText("Check your wallet")
    const contractCallParams = [
      NULL_ADDRESS,
      credentialType,
      guildId,
      metadataCID,
      { value: credentialFee },
    ]

    try {
      await guildCredentialContract.callStatic.claim(...contractCallParams)
    } catch (callstaticError) {
      return Promise.reject(callstaticError.errorName ?? "Contract error")
    }

    return guildCredentialContract.claim(...contractCallParams)
  }

  return {
    ...useSubmitTransaction<null>(mintCredential, {
      onSuccess: () => {
        setLoadingText("")
        toast({
          status: "success",
          title: "Successfully minted credential!",
          description:
            "You'll receive your NFT once our contract validates your eligibility",
        })
      },
      onError: (error) => {
        showErrorToast(error)
        setLoadingText("")
      },
    }),
    loadingText,
  }
}

export default useMintCredential
