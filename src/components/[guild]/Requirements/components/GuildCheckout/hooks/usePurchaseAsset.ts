import { BigNumberish } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import useContract from "hooks/useContract"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import { SupportedSources } from "pages/api/fetchPrice"
import { Dispatch, SetStateAction } from "react"
import TOKEN_BUYER_ABI from "static/abis/tokenBuyerAbi.json"
import {
  NULL_ADDRESS,
  purchaseSupportedChains,
  TOKEN_BUYER_CONTRACT,
} from "utils/guildCheckout/constants"
import {
  encodePermit2Permit,
  encodeUnwrapEth,
  encodeV2SwapExactOut,
  encodeV3SwapExactOut,
  encodeWrapEth,
  UNIVERSAL_ROUTER_COMMANDS,
} from "utils/guildCheckout/encoders"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"
import usePrice from "./usePrice"

const {
  WRAP_ETH,
  UNWRAP_WETH,
  V2_SWAP_EXACT_OUT,
  V3_SWAP_EXACT_OUT,
  PERMIT2_PERMIT,
} = UNIVERSAL_ROUTER_COMMANDS

type PurchaseAssetData = {
  chainId: number
  account: string
  tokenBuyerContract: Contract
  tokenAddress: string
  amountIn: BigNumberish // amount which we got back from the 0x API (in WEI)
  amountInWithFee: BigNumberish // amount which we got back from the 0x API + Guild fee (in WEI)
  amountOut: BigNumberish // token amount which we'd like to purchase (in WEI)
  source: SupportedSources
  path: string
  tokenAddressPath: string[]
}

type BuyTokenType = "COIN" | "ERC20"

const permit2PermitFakeParams: [string, number, number, string, string, string] = [
  "1461501637330902918203684832716283019655932542975",
  1706751423,
  0,
  "0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5",
  "1704161223",
  "0x43d422359b743755a8c8de3cd7b54c20c381084ce597d8135a3051382c96a2344d6d236a3f4a685c91bb036780ca7f90d69cbe9df8982ec022b6990f7f9b22751c",
]

const getAssetsCallParams: Record<
  BuyTokenType,
  Record<
    SupportedSources,
    { commands: string; getEncodedParams: (data: PurchaseAssetData) => string[] }
  >
> = {
  COIN: {
    Uniswap_V2: {
      commands: WRAP_ETH + V2_SWAP_EXACT_OUT + UNWRAP_WETH,
      getEncodedParams: ({ account, amountIn, amountOut, tokenAddressPath }) => [
        encodeWrapEth("0x0000000000000000000000000000000000000002", amountIn),
        encodeV2SwapExactOut(account, amountOut, amountIn, tokenAddressPath, false),
        encodeUnwrapEth(account, 0),
      ],
    },
    Uniswap_V3: {
      commands: WRAP_ETH + V3_SWAP_EXACT_OUT + UNWRAP_WETH,
      getEncodedParams: ({ account, amountIn, amountOut, path }) => [
        encodeWrapEth("0x0000000000000000000000000000000000000002", amountIn),
        encodeV3SwapExactOut(account, amountOut, amountIn, path, false),
        encodeUnwrapEth(account, 0),
      ],
    },
  },
  ERC20: {
    Uniswap_V2: {
      commands: PERMIT2_PERMIT + V2_SWAP_EXACT_OUT,
      getEncodedParams: ({
        account,
        amountIn,
        amountOut,
        tokenAddress,
        tokenAddressPath,
      }) => [
        encodePermit2Permit(tokenAddress, ...permit2PermitFakeParams),
        encodeV2SwapExactOut(account, amountOut, amountIn, tokenAddressPath, false),
      ],
    },
    Uniswap_V3: {
      commands: PERMIT2_PERMIT + V3_SWAP_EXACT_OUT,
      getEncodedParams: ({ account, amountIn, amountOut, path, tokenAddress }) => [
        encodePermit2Permit(tokenAddress, ...permit2PermitFakeParams),
        encodeV3SwapExactOut(account, amountOut, amountIn, path, false),
      ],
    },
  },
}

const purchaseAsset = async (
  data: PurchaseAssetData,
  setTxHash: Dispatch<SetStateAction<string>>
) => {
  const { chainId, tokenBuyerContract, tokenAddress, amountInWithFee, source } = data

  if (!purchaseSupportedChains.ERC20?.includes(Chains[chainId]))
    return Promise.reject("Unsupported chain")

  const isNativeCurrency =
    tokenAddress === RPC[Chains[chainId]].nativeCurrency.symbol

  const gasPrice = await tokenBuyerContract.provider.getGasPrice()

  console.log(
    `getAssetsCallParams->${isNativeCurrency ? "COIN" : "ERC20"}->${source}`
  )

  const getAssetsMainParams = [
    {
      tokenAddress: isNativeCurrency ? NULL_ADDRESS : tokenAddress,
      amount: isNativeCurrency ? 0 : amountInWithFee,
    },
    `0x${getAssetsCallParams[isNativeCurrency ? "COIN" : "ERC20"][source].commands}`,
    getAssetsCallParams[isNativeCurrency ? "COIN" : "ERC20"][
      source
    ].getEncodedParams(data),
    ,
  ]

  const getAssetsExtraParams = {
    value: isNativeCurrency ? amountInWithFee : undefined,
    gasPrice: gasPrice,
    gasLimit: undefined,
  }

  const getAssetsGasEstimation = await tokenBuyerContract.estimateGas.getAssets(
    ...getAssetsMainParams,
    getAssetsExtraParams
  )

  getAssetsExtraParams.gasLimit = getAssetsGasEstimation

  const getAssetsParams = [...getAssetsMainParams, getAssetsExtraParams]

  const getAssetsCall = await tokenBuyerContract.getAssets(...getAssetsParams)

  setTxHash(getAssetsCall.hash)

  return getAssetsCall.wait()
}

const usePurchaseAsset = () => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { account, chainId } = useWeb3React()

  const {
    requirement,
    pickedCurrency,
    txHash,
    setTxHash,
    setTxSuccess,
    setTxError,
  } = useGuildCheckoutContext()
  const { data: priceData } = usePrice(pickedCurrency)

  const tokenBuyerContract = useContract(TOKEN_BUYER_CONTRACT, TOKEN_BUYER_ABI, true)

  const {
    data: { decimals },
  } = useTokenData(Chains[chainId], pickedCurrency)
  const {
    data: { decimals: buyTokenDecimals },
  } = useTokenData(Chains[chainId], requirement?.address)

  const amountIn =
    priceData && decimals
      ? parseUnits(priceData.price.toFixed(decimals), decimals)
      : undefined

  const guildFeeInWei =
    priceData && decimals
      ? parseUnits(priceData.guildFee.toFixed(decimals), decimals)
      : undefined

  const amountInWithFee =
    amountIn && guildFeeInWei ? amountIn.add(guildFeeInWei) : undefined

  const amountOut =
    priceData && buyTokenDecimals
      ? parseUnits(priceData.buyAmount.toFixed(buyTokenDecimals), buyTokenDecimals)
      : undefined

  const purchaseAssetWithSetTx = (data?: PurchaseAssetData) =>
    purchaseAsset(data, setTxHash)

  const useSubmitData = useSubmit<PurchaseAssetData, any>(purchaseAssetWithSetTx, {
    onError: (error) => {
      const prettyError =
        error.code === "ACTION_REJECTED" ? "User rejected the transaction" : error
      showErrorToast(prettyError)
      if (txHash) setTxError(true)
    },
    onSuccess: (receipt) => {
      if (receipt.status !== 1) {
        showErrorToast("Transaction failed")
        setTxError(true)
        console.log("[DEBUG]: TX RECEIPT", receipt)
        return
      }

      setTxSuccess(true)
      toast({
        status: "success",
        title: "Success",
        description: "Todo...",
      })
    },
  })

  return {
    ...useSubmitData,
    onSubmit: () =>
      useSubmitData.onSubmit({
        chainId,
        account,
        tokenBuyerContract,
        tokenAddress: pickedCurrency,
        amountIn,
        amountInWithFee,
        amountOut,
        source: priceData?.source,
        path: priceData?.path,
        tokenAddressPath: priceData?.tokenAddressPath,
      }),
  }
}

export default usePurchaseAsset
