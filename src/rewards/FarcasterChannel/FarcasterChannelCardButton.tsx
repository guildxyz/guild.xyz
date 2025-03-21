import { ToastAction } from "@/components/ui/Toast"
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { useClaimedReward } from "hooks/useClaimedReward"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useUserRewards } from "hooks/useUserRewards"
import { RewardCardButton } from "rewards/components/RewardCardButton"
import FarcasterLogo from "static/socialIcons/farcaster.svg"
import fetcher from "utils/fetcher"
import { useErrorToast } from "v2/components/ui/hooks/useErrorToast"
import { useToast } from "v2/components/ui/hooks/useToast"

const FarcasterChannelCardButton = () => {
  const { id: userId } = useUser()
  const { id: guildId, guildPlatforms } = useGuild()

  const rolePlatform = useRolePlatform()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.id === rolePlatform.guildPlatformId
  )

  const { isMember: hasRole } = useRoleMembership(rolePlatform?.roleId)
  const { mutate: mutateUserReward } = useUserRewards()
  const { claimed } = useClaimedReward(rolePlatform?.id)

  const claimFetcher = (signedValidation: SignedValidation) =>
    fetcher(
      `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms/${rolePlatform.id}/claim`,
      {
        method: "POST",
        ...signedValidation,
      }
    )

  const channelLink = `https://warpcast.com/~/channel/${guildPlatform?.platformGuildId}`

  const { toast } = useToast()
  const showErrorToast = useErrorToast()
  const { onSubmit: onGetInviteSubmit, isLoading } = useSubmitWithSign(
    claimFetcher,
    {
      onSuccess: () => {
        mutateUserReward()
        toast({
          variant: "success",
          title: "Successfully claimed invite link",
          action: (
            <ToastAction altText="Visit channel" asChild>
              <a href={channelLink} target="_blank">
                <FarcasterLogo className="size-4" />
                <span>Visit channel</span>
              </a>
            </ToastAction>
          ),
        })
      },
      onError: (error) => showErrorToast(error),
    }
  )

  const shouldShowVisitChannel =
    claimed || userId === guildPlatform?.platformGuildData?.moderatorUserId

  const buttonProps = shouldShowVisitChannel
    ? ({
        as: "a",
        target: "_blank",
        href: channelLink,
        rightIcon: <ArrowSquareOut weight="bold" />,
      } as const)
    : ({
        onClick: () => onGetInviteSubmit(),
      } as const)

  return (
    <RewardCardButton
      {...buttonProps}
      isDisabled={!hasRole}
      colorScheme="FARCASTER"
      isLoading={isLoading}
      loadingText="Getting invite..."
    >
      {shouldShowVisitChannel ? "Visit channel" : "Get invite"}
    </RewardCardButton>
  )
}
export { FarcasterChannelCardButton }
