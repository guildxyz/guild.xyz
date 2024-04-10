import { Chain } from "@guildxyz/types"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import fetcher from "utils/fetcher"
import { ERC20_CONTRACT } from "utils/guildCheckout/constants"
import { useReadContract } from "wagmi"
import { Chains } from "wagmiConfig/chains"

const useClaimToken = (chain: Chain, roleId?: number, rolePlatformId?: number) => {
  const { id: guildId } = useGuild()

  const endpoint = `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`

  const { triggerMembershipUpdate } = useMembershipUpdate({
    onSuccess: (reponse) => {
      onClaimSubmit()
    },
  })

  const claimFetcher = (signedValidation: SignedValidation) =>
    fetcher(endpoint, {
      method: "POST",
      ...signedValidation,
    })

  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()

  const onSubmit = () => {
    if (!roleId) return
    triggerMembershipUpdate({ roleIds: [roleId], saveClaimData: true })
  }
  const { onSubmit: onClaimSubmit, ...claim } = useSubmitWithSign(claimFetcher, {
    onSuccess: (response) => {
      triggerConfetti()
      console.log(response)
    },
    onError: (error) => {
      console.error(error)
      showErrorToast(error)
    },
  })

  /** TODO: Claim will need to use the response of the current onClaimSubmit call */
  // const claimArgs = [
  //     poolId,
  //     rolePlatformId,
  //     amount,
  //     singedAt,
  //     userId,
  //     signature
  // ]
  // const claimTransactionConfig = {
  //     abi: tokenRewardPoolAbi,
  //     address: ERC20_CONTRACT,
  //     functonName: "claim",
  //     args: claimArgs,
  //     query: {
  //         claimEnabled,
  //     },
  // }
  // const { onSubmitTransaction: claimTransactionSubmit, isLoading: claimIsLoading } = useSubmitTransaction(transactionConfig)

  const feeTransactionConfig = {
    abi: tokenRewardPoolAbi,
    address: ERC20_CONTRACT,
    functionName: "fee",
    chainId: Chains[chain],
  } as const
  const {
    data: fee,
    isLoading: isFeeLoading,
    error,
  } = useReadContract(feeTransactionConfig)
  return { fee, isFeeLoading, onSubmit }
}

export default useClaimToken
