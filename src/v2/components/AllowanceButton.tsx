"use client"

import { Info } from "@phosphor-icons/react"
import useAllowance from "components/[guild]/Requirements/components/GuildCheckout/hooks/useAllowance"
import useTokenData from "hooks/useTokenData"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { useAccount } from "wagmi"
import { Chain, Chains } from "wagmiConfig/chains"
import { Button } from "./ui/Button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip"

type Props = {
  chain: Chain
  token: `0x${string}`
  contract: `0x${string}`
}

export const AllowanceButton = ({ chain, token, contract }: Props) => {
  const {
    data: { symbol: tokenSymbol, name: tokenName },
  } = useTokenData(chain, token)

  const {
    allowance,
    isAllowanceLoading,
    isAllowing,
    allowanceError,
    allowSpendingTokens,
  } = useAllowance(token, contract)

  const tokenIsNative = token === NULL_ADDRESS
  const { chainId } = useAccount()
  const isOnCorrectChain = Chains[chain] === chainId
  const disable = !allowance && !tokenIsNative && isOnCorrectChain

  return (
    <Button
      disabled={disable}
      className="w-full"
      isLoading={isAllowanceLoading || isAllowing}
      colorScheme={allowanceError ? "destructive" : "info"}
      loadingText={
        isAllowanceLoading
          ? "Checking allowance"
          : isAllowing
            ? "Allowing"
            : "Check your wallet"
      }
      onClick={allowSpendingTokens}
      // disabled={!didVerify || didAllowEth}
      // onClick={() => {
      //   setDidAllowEth(true)
      // }}
    >
      {allowanceError
        ? "Couldn't fetch allowance"
        : `Allow Guild to use your ${tokenSymbol}`}

      <Tooltip>
        <TooltipTrigger>
          <Info />
        </TooltipTrigger>
        <TooltipContent>{`You have to give the Guild smart contracts permission to use your ${tokenName}. You only have to do this once per token.`}</TooltipContent>
      </Tooltip>
    </Button>
  )
}
