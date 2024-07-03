import type { ExtractAbiFunctions } from "abitype"
import useEditRolePlatform from "components/[guild]/AccessHub/hooks/useEditRolePlatform"
import { CreateNftFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/NftDataForm"
import { generateGuildRewardNFTMetadata } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import pinFileToIPFS from "hooks/usePinata/utils/pinataUpload"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useCallback } from "react"
import { FormState } from "react-hook-form"
import guildRewardNftAbi from "static/abis/guildRewardNft"
import processViemContractError from "utils/processViemContractError"
import { encodeFunctionData, parseUnits } from "viem"
import { useWalletClient } from "wagmi"
import { wagmiConfig } from "wagmiConfig"
import { CHAIN_CONFIG, Chain, Chains } from "wagmiConfig/chains"

const useEditNft = ({
  guildPlatformId,
  rolePlatformId,
  onSuccess,
}: {
  guildPlatformId: number
  rolePlatformId: number
  onSuccess: () => void
}) => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()
  const showSuccessToast = useCallback(
    () =>
      toast({
        status: "success",
        title: "Successfully edited NFT",
      }),
    [toast]
  )

  const editRolePlatform = useEditRolePlatform({
    rolePlatformId,
    onSuccess: () => {
      showSuccessToast()
      onSuccess()
    },
  })

  const { guildPlatform } = useGuildPlatform(guildPlatformId)
  const { data: walletClient } = useWalletClient()

  const editNftContractCalls = async ({
    fields,
    dirtyFields,
  }: {
    fields: CreateNftFormType
    dirtyFields: FormState<CreateNftFormType>["dirtyFields"]
  }) => {
    const data = getNftDataFormDirtyFields(fields, dirtyFields)

    const { contractData, apiData } = separateContractAndAPIData(data)

    if (Object.keys(contractData).length > 0) {
      /**
       * Calling encoders for every function (even if we don't need it) & filtering
       * out undefined values was easier than making sure that we only call it for
       * the modified data
       */

      const transactions = (
        await Promise.all(
          Object.values(functionEncoders).map((encoder) =>
            encoder({
              data: fields,
              dirtyData: contractData,
              chain: guildPlatform.platformGuildData.chain,
            })
          )
        )
      ).filter(Boolean)

      await walletClient.writeContract({
        account: walletClient.account,
        abi: guildRewardNftAbi,
        address: guildPlatform.platformGuildData.contractAddress,
        chain: wagmiConfig.chains.find(
          (c) => c.id === Chains[guildPlatform.platformGuildData.chain]
        ),
        functionName: "multicall",
        args: [transactions],
      })
    }

    // Returning the data which we need to send to our API, so we can use it directly in editGuildPlatform.onSubmit
    return apiData
  }

  const editNft = useSubmit(editNftContractCalls, {
    onSuccess: (apiData) => {
      if (!Object.keys(apiData.rolePlatform).length) {
        showSuccessToast()
        onSuccess()
        return
      }

      return editRolePlatform.onSubmit(apiData.rolePlatform)
    },
    onError: (error) => {
      const prettyError = processViemContractError(error)
      showErrorToast(prettyError)
    },
  })

  return {
    onSubmit: editNft.onSubmit,
    isLoading: editNft.isLoading || editRolePlatform.isLoading,
  }
}

const getNftDataFormDirtyFields = (
  data: CreateNftFormType,
  dirtyFields: FormState<CreateNftFormType>["dirtyFields"]
) => {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
    name: _name,
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
    chain: _chain,
    attributes,
    ...rootFields
  } = data

  const { attributes: dirtyAttributes, ...dirtyRootFields } = dirtyFields

  const hasDirtyAttributes = dirtyAttributes?.some((attr) => attr.name || attr.value)

  const filteredData: Partial<CreateNftFormType> = {}

  if (hasDirtyAttributes) {
    filteredData.attributes = attributes
  }

  for (const key of Object.keys(dirtyRootFields)) {
    if (!!dirtyRootFields[key]) filteredData[key] = rootFields[key]
  }

  return filteredData
}

const NFT_ROLE_PLATFORM_KEYS = [
  "startTime",
  "endTime",
] as const satisfies (keyof CreateNftFormType)[]
type RolePlatformKeys = (typeof NFT_ROLE_PLATFORM_KEYS)[number]

const separateContractAndAPIData = (data: Partial<CreateNftFormType>) => {
  const apiData: {
    rolePlatform: Partial<Pick<CreateNftFormType, RolePlatformKeys>>
  } = { rolePlatform: {} }

  const contractData: Partial<Omit<CreateNftFormType, RolePlatformKeys>> = {}

  for (const key of Object.keys(data)) {
    if (NFT_ROLE_PLATFORM_KEYS.includes(key as RolePlatformKeys)) {
      apiData.rolePlatform[key] = data[key]
    } else {
      contractData[key] = data[key]
    }
  }

  return { apiData, contractData }
}

// This might seem a bit tricky, but we just extract the function names which can be used for editing the NFT's data, and specify an encoder for each of them.

type NonPayableContractFunctionNames = ExtractAbiFunctions<
  typeof guildRewardNftAbi,
  "nonpayable"
>["name"]
type RelevantFunctionNames = Exclude<
  NonPayableContractFunctionNames,
  | "approve"
  | "burn"
  | "initialize"
  | "multicall"
  | "renounceOwnership"
  | "safeTransferFrom"
  | "setApprovalForAll"
  | "transferFrom"
  | "transferOwnership"
>

// Passing the original formData here too, so we can properly generate the new metadata for the NFT
const functionEncoders: Record<
  RelevantFunctionNames,
  ({
    data,
    dirtyData,
    chain,
  }: {
    data: CreateNftFormType
    dirtyData: ReturnType<typeof separateContractAndAPIData>["contractData"]
    chain: Chain
  }) => Promise<`0x${string}`>
> = {
  setFee: async ({ dirtyData, chain }) => {
    if (typeof dirtyData.price === "undefined") return undefined

    const fee = parseUnits(
      dirtyData.price.toString(),
      CHAIN_CONFIG[chain].nativeCurrency.decimals
    )

    return encodeFunctionData({
      abi: guildRewardNftAbi,
      functionName: "setFee",
      args: [fee],
    })
  },
  setLocked: async ({ dirtyData }) => {
    if (typeof dirtyData.soulbound === "undefined") return undefined

    return encodeFunctionData({
      abi: guildRewardNftAbi,
      functionName: "setLocked",
      args: [dirtyData.soulbound === "true"],
    })
  },
  setMaxSupply: async ({ dirtyData }) => {
    if (typeof dirtyData.maxSupply === "undefined") return undefined

    return encodeFunctionData({
      abi: guildRewardNftAbi,
      functionName: "setMaxSupply",
      args: [BigInt(dirtyData.maxSupply)],
    })
  },
  setMintableAmountPerUser: async ({ dirtyData }) => {
    if (typeof dirtyData.mintableAmountPerUser === "undefined") return undefined

    return encodeFunctionData({
      abi: guildRewardNftAbi,
      functionName: "setMintableAmountPerUser",
      args: [BigInt(dirtyData.mintableAmountPerUser)],
    })
  },
  setTreasury: async ({ dirtyData }) => {
    if (typeof dirtyData.tokenTreasury === "undefined") return undefined

    return encodeFunctionData({
      abi: guildRewardNftAbi,
      functionName: "setTreasury",
      args: [dirtyData.tokenTreasury],
    })
  },
  updateTokenURI: async ({ data, dirtyData }) => {
    if (
      typeof dirtyData.image === "undefined" &&
      typeof dirtyData.attributes === "undefined" &&
      typeof dirtyData.description === "undefined"
    )
      return undefined

    const metadata = generateGuildRewardNFTMetadata(data)
    const metadataJSON = JSON.stringify(metadata)

    const { IpfsHash: metadataCID } = await pinFileToIPFS({
      data: [metadataJSON],
      fileNames: ["metadata.json"],
    })

    return encodeFunctionData({
      abi: guildRewardNftAbi,
      functionName: "updateTokenURI",
      args: [metadataCID],
    })
  },
} as const

export default useEditNft
