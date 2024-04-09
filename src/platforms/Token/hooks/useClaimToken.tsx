const useClaimToken = () => {
  // const { id: guildId } = useGuild()
  // const { roles } = useGuild()
  // const roleOfReward = roles.find((role) =>
  //   role.rolePlatforms.find((rolePlatform) => rolePlatform.id === guildPlatform.id)
  // )
  // const endpoint = `/v2/guilds/${guildId}/roles/${roleOfReward?.id}/role-platforms/${guildPlatform?.id}/claim`
  // const { data: claimData } = useSWRWithOptionalAuth(endpoint)
  // // const claimArgs = [
  // //     poolId,
  // //     rolePlatformId,
  // //     amount,
  // //     singedAt,
  // //     userId,
  // //     signature
  // // ]
  // // const claimTransactionConfig = {
  // //     abi: tokenRewardPoolAbi,
  // //     address: ERC20_CONTRACT,
  // //     functonName: "claim",
  // //     args: claimArgs,
  // //     query: {
  // //         claimEnabled,
  // //     },
  // // }
  // // const { onSubmitTransaction: claimTransactionSubmit, isLoading: claimIsLoading } = useSubmitTransaction(transactionConfig)
  // const feeTransactionConfig = {
  //   abi: tokenRewardPoolAbi,
  //   address: ERC20_CONTRACT,
  //   functionName: "fee",
  //   chainId: Chains[guildPlatform?.platformGuildData?.chain],
  // } as const
  // const {
  //   data: fee,
  //   isLoading: feeLoading,
  //   error,
  // } = useReadContract(feeTransactionConfig)
  // return { fee, feeLoading }
}

export default useClaimToken
