/**
 * - Upload image => get its cid
 * - Generate metadata & upload it => get its cid
 * - Contract call => get the new contract's address
 * - Guild api call => save the created reward to the CreateNftContext
 */

import useGuild from "components/[guild]/hooks/useGuild"
import pinFileToIPFS from "hooks/usePinata/utils/pinataUpload"
import useSubmit from "hooks/useSubmit"
import { useState } from "react"
import { GuildPlatform, PlatformType } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { CreateNftContextType, useCreateNftContext } from "../../CreateNftContext"
import { CreateNftFormType } from "../CreateNftForm"

type NftMetadata = {
  name: string
  description?: string
  image: string
  attributes: { trait_type: string; value: string }[] // TODO: maybe add display_type too?
}

export enum ContractCallFunction {
  SIMPLE_CLAIM = "function claim(address payToken, address receiver, bytes calldata signature) payable",
}

const contractCallArgsToSign: Record<ContractCallFunction, string[]> = {
  [ContractCallFunction.SIMPLE_CLAIM]: [],
}

const useCreateNft = () => {
  const { id: guildId } = useGuild()
  const { setData } = useCreateNftContext()
  const [loadingText, setLoadingText] = useState<string>()

  const fetcherWithSign = useFetcherWithSign()

  const createNft = async (data: CreateNftFormType): Promise<GuildPlatform> => {
    setLoadingText("Uploading image")

    const { IpfsHash: imageCID } = await pinFileToIPFS({
      data: [data.image],
    })

    setLoadingText("Uploading metadata")

    const image = `ipfs://${imageCID}`

    const metadata: NftMetadata = {
      name: data.name,
      description: data.description,
      image,
      attributes:
        data.attributes?.map((attr) => ({
          trait_type: attr.name,
          value: attr.value,
        })) ?? [],
    }

    const metadataJSON = JSON.stringify(metadata)

    const { IpfsHash: metadataCID } = await pinFileToIPFS({
      data: [metadataJSON],
      fileNames: ["metadata.json"],
    })

    setLoadingText("Deploying contract")

    // TODO: contract call => get the contract address, and then call the POST /guild/:id/platform endpoint

    // TODO
    const createdContractAddress = NULL_ADDRESS

    return fetcherWithSign([
      // TODO: change this to the v2 endpoint once we merge the v2 api related changes
      `/FORCE_V2/guilds/${guildId}/guild-platforms`,
      {
        body: {
          platformId: PlatformType.CONTRACT_CALL,
          platformName: "CONTRACT_CALL",
          platformGuildId: `${guildId}-${createdContractAddress}-${Date.now()}`,
          platformGuildData: {
            chain: data.chain,
            contractAddress: createdContractAddress,
            function: ContractCallFunction.SIMPLE_CLAIM,
            argsToSign: contractCallArgsToSign[ContractCallFunction.SIMPLE_CLAIM],
            description: data.description,
          },
        },
      },
    ])

    // test data
    return {
      id: 0,
      platformGuildId: "randomuuid",
      platformGuildName: "",
      platformId: PlatformType.CONTRACT_CALL,
      platformName: "CONTRACT_CALL",
      platformGuildData: {
        chain: data.chain,
        contractAddress: NULL_ADDRESS,
        function: ContractCallFunction.SIMPLE_CLAIM,
        argsToSign: [],
        description: data.description,
      },
    }
  }

  return {
    ...useSubmit(createNft, {
      onSuccess: (createdContractCallReward) => {
        // TODO: mutate guildPlatforms
        setLoadingText(null)
        setData(
          createdContractCallReward.platformGuildData as CreateNftContextType["data"]
        )
        console.log("createdContractCallReward", createdContractCallReward)
        // TODO: toast
      },
      onError: () => {
        setLoadingText(null)
        // TODO: error toast
      },
    }),
    loadingText,
  }
}

export default useCreateNft
