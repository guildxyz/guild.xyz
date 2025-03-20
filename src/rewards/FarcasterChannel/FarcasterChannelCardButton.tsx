import useGuild from "components/[guild]/hooks/useGuild"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { useClaimedReward } from "hooks/useClaimedReward"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useUserRewards } from "hooks/useUserRewards"
import { RewardCardButton } from "rewards/components/RewardCardButton"
import fetcher from "utils/fetcher"
import useShowErrorToast from "hooks/useShowErrorToast"

const FarcasterChannelCardButton = () => {
  const rolePlatform = useRolePlatform()
  const { isMember: hasRole } = useRoleMembership(rolePlatform?.roleId)
  const { mutate: mutateUserReward } = useUserRewards()
  const { claimed } = useClaimedReward(rolePlatform?.id)

  const { id: guildId } = useGuild()
  const claimFetcher = (signedValidation: SignedValidation) =>
    fetcher(
      `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms/${rolePlatform.id}/claim`,
      {
        method: "POST",
        ...signedValidation,
      }
    )

  const showErrorToast = useShowErrorToast()

  const { onSubmit: onGetInviteSubmit, isLoading } = useSubmitWithSign(
    claimFetcher,
    {
      onSuccess: () => {
        mutateUserReward()
      },
      onError: (error) => showErrorToast(error),
    }
  )

  return (
    <RewardCardButton
      isDisabled={!hasRole}
      colorScheme="FARCASTER"
      isLoading={isLoading}
      loadingText="Getting invite..."
      onClick={() => onGetInviteSubmit()}
    >
      {claimed ? "Visit channel" : "Get invite"}
    </RewardCardButton>
  )
}
export { FarcasterChannelCardButton }
