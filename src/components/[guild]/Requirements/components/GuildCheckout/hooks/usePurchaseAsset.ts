// import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
// import { Contract } from "@ethersproject/contracts"
import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmitTransaction from "hooks/useSubmitTransaction"
import useToast from "hooks/useToast"
import useToken from "hooks/useToken"
import useTokenBalance from "hooks/useTokenBalance"
import { useMemo } from "react"
import {
  ADDRESS_REGEX,
  NULL_ADDRESS,
  TOKEN_BUYER_CONTRACTS,
} from "utils/guildCheckout/constants"
import { generateGetAssetsParams } from "utils/guildCheckout/utils"
import { useAccount, useBalance } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import { useRequirementContext } from "../../RequirementContext"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContext"
import useAllowance from "./useAllowance"
import usePrice from "./usePrice"

const usePurchaseAsset = () => {
  const { captureEvent } = usePostHogContext()
  const { id: guildId, urlName } = useGuild()

  const requirement = useRequirementContext()
  const { pickedCurrency } = useGuildCheckoutContext()

  const { triggerMembershipUpdate } = useMembershipUpdate()

  const postHogOptions = { guild: urlName, chain: requirement.chain }

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const { address, chainId } = useAccount()

  const { data: priceData } = usePrice(pickedCurrency)

  const generatedGetAssetsParams = useMemo(
    () =>
      generateGetAssetsParams(guildId, address, chainId, pickedCurrency, priceData),
    [guildId, address, chainId, pickedCurrency, priceData]
  )

  const { allowance } = useAllowance(
    pickedCurrency,
    TOKEN_BUYER_CONTRACTS[Chains[chainId]]?.address
  )

  const { data: coinBalanceData } = useBalance({
    address,
    chainId: Chains[requirement?.chain],
  })
  const { data: tokenBalanceData } = useTokenBalance({
    token: pickedCurrency,
    chainId: Chains[requirement?.chain],
    shouldFetch: pickedCurrency !== NULL_ADDRESS,
  })

  const { data: purchasedTokenData } = useToken({
    address: requirement?.address as `0x${string}`,
    chainId: Chains[requirement?.chain],
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
      TOKEN_BUYER_CONTRACTS[Chains[chainId]] &&
      contractCallParams
  )

  const config = {
    abi: TOKEN_BUYER_CONTRACTS[Chains[chainId]]?.abi,
    address: TOKEN_BUYER_CONTRACTS[Chains[chainId]]?.address,
    functionName: "getAssets",
    args: contractCallParams,
    value: generatedGetAssetsParams?.value,
    query: {
      enabled,
    },
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

      triggerMembershipUpdate({ roleIds: [requirement.roleId] })

      toast({
        status: "success",
        title: "Your new asset:",
        description: `${requirement.data.minAmount} ${purchasedTokenData?.symbol}`,
      })
    },
  })
}

export default usePurchaseAsset
