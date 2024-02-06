// import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
// import { Contract } from "@ethersproject/contracts"
import { Chains } from "chains"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import useToast from "hooks/useToast"
import { useMemo } from "react"
import { ADDRESS_REGEX, NULL_ADDRESS } from "utils/guildCheckout/constants"
import { generateGetAssetsParams } from "utils/guildCheckout/utils"
import { useAccount, useBalance, useChainId } from "wagmi"
import { useRequirementContext } from "../../RequirementContext"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"
import useAllowance from "./useAllowance"
import usePrice from "./usePrice"
import useTokenBuyerContractData from "./useTokenBuyerContractData"

const usePurchaseAsset = () => {
  const { captureEvent } = usePostHogContext()
  const { id: guildId, urlName } = useGuild()

  const requirement = useRequirementContext()
  const { pickedCurrency } = useGuildCheckoutContext()

  const { triggerMembershipUpdate } = useMembershipUpdate()

  const postHogOptions = { guild: urlName, chain: requirement.chain }

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { address } = useAccount()
  const chainId = useChainId()

  const { data: priceData } = usePrice(pickedCurrency)

  const tokenBuyerContractData = useTokenBuyerContractData()

  const generatedGetAssetsParams = useMemo(
    () =>
      generateGetAssetsParams(guildId, address, chainId, pickedCurrency, priceData),
    [guildId, address, chainId, pickedCurrency, priceData]
  )

  const { allowance } = useAllowance(
    pickedCurrency,
    tokenBuyerContractData[Chains[chainId]]?.address
  )

  const { data: coinBalanceData } = useBalance({
    address,
    chainId: Chains[requirement?.chain],
  })
  const { data: tokenBalanceData } = useBalance({
    address,
    token: pickedCurrency,
    chainId: Chains[requirement?.chain],
    enabled: pickedCurrency !== NULL_ADDRESS,
  })

  const isSufficientBalance =
    priceData?.maxPriceInWei &&
    (coinBalanceData || tokenBalanceData) &&
    (pickedCurrency === NULL_ADDRESS
      ? coinBalanceData?.value >= priceData.maxPriceInWei
      : tokenBalanceData?.value >= priceData.maxPriceInWei)

  const contractCallParams = generatedGetAssetsParams
    ? ([...generatedGetAssetsParams.params] as const)
    : undefined

  const enabled = Boolean(
    requirement?.chain === Chains[chainId] &&
      priceData &&
      isSufficientBalance &&
      (pickedCurrency !== NULL_ADDRESS && ADDRESS_REGEX.test(pickedCurrency)
        ? typeof allowance === "bigint" && priceData.maxPriceInWei <= allowance
        : true) &&
      tokenBuyerContractData[Chains[chainId]] &&
      contractCallParams
  )

  const config = {
    abi: tokenBuyerContractData[Chains[chainId]]?.abi,
    address: tokenBuyerContractData[Chains[chainId]]?.address,
    functionName: "getAssets",
    args: contractCallParams,
    value: generatedGetAssetsParams?.value,
    enabled,
  }

  return useSubmitTransaction(config, {
    onError: (errorMessage, error) => {
      showErrorToast(errorMessage)
      captureEvent("Purchase requirement error (GuildCheckout)", {
        ...postHogOptions,
        error,
      })
    },
    onSuccess: () => {
      captureEvent("Purchased requirement (GuildCheckout)", postHogOptions)

      triggerMembershipUpdate()

      toast({
        status: "success",
        title: "Your new asset:",
        description: `${requirement.data.minAmount} ${tokenBalanceData?.symbol}`,
      })
    },
  })
}

export default usePurchaseAsset
