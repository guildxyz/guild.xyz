import { Icon, Spinner, Text, Tooltip } from "@chakra-ui/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import AvailabilityTags, {
  getTimeDiff,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMemberships"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import useClaimText, {
  ClaimTextModal,
} from "platforms/SecretText/hooks/useClaimText"
import platforms from "platforms/platforms"
import { useMemo } from "react"
import { PlatformType } from "types"
import { useAccount } from "wagmi"
import { useClaimedReward } from "../../hooks/useClaimedReward"

const SecretTextReward = ({ platform, withMotionImg }: RewardProps) => {
  const { platformId, platformGuildData } = platform.guildPlatform

  const { claimed } = useClaimedReward(platform.id)

  const {
    onSubmit,
    isLoading,
    error,
    response,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimText(platform.id)
  const { roles } = useGuild()
  const role = roles.find((r) =>
    r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.guildPlatformId)
  )

  const isMember = useIsMember()
  const { hasRoleAccess, isValidating: isAccessValidating } = useRoleMembership(
    role.id
  )
  const { isConnected } = useAccount()
  const openJoinModal = useOpenJoinModal()

  const label = platformId === PlatformType.TEXT ? "Reveal secret" : "Claim"

  const state = useMemo(() => {
    if (isMember && hasRoleAccess) {
      const startTimeDiff = getTimeDiff(platform?.startTime)
      const endTimeDiff = getTimeDiff(platform?.endTime)

      if (
        (startTimeDiff > 0 ||
          endTimeDiff < 0 ||
          (typeof platform?.capacity === "number" &&
            platform?.capacity === platform?.claimedCount)) &&
        !claimed
      )
        return {
          tooltipLabel:
            platform?.capacity === platform?.claimedCount
              ? "All available rewards have already been claimed"
              : startTimeDiff > 0
              ? "Claim hasn't started yet"
              : "Claim already ended",
          buttonProps: {
            isDisabled: true,
          },
        }

      return {
        tooltipLabel: label,
        buttonProps: {},
      }
    }

    if (!isConnected || (!isMember && hasRoleAccess))
      return {
        tooltipLabel: (
          <>
            <Icon as={LockSimple} display="inline" mb="-2px" mr="1" />
            Join guild to get access
          </>
        ),
        buttonProps: { onClick: openJoinModal },
      }
    return {
      tooltipLabel: "You don't satisfy the requirements to this role",
      buttonProps: { isDisabled: true },
    }
  }, [claimed, isMember, hasRoleAccess, isConnected, platform])

  return (
    <>
      <RewardDisplay
        icon={
          isLoading ? (
            <Spinner boxSize={6} />
          ) : (
            <RewardIcon
              rolePlatformId={platform.id}
              guildPlatform={platform?.guildPlatform}
              withMotionImg={withMotionImg}
            />
          )
        }
        label={
          isLoading ? (
            <Text opacity={0.5}>Claiming reward...</Text>
          ) : (
            <Tooltip label={state.tooltipLabel} hasArrow shouldWrapChildren>
              {`${label}: `}
              <Button
                variant="link"
                rightIcon={
                  isAccessValidating ? <Spinner boxSize="1em" /> : <ArrowSquareOut />
                }
                iconSpacing="1"
                maxW="full"
                onClick={() => {
                  onOpen()
                  if (!response) onSubmit()
                }}
                {...state.buttonProps}
              >
                {platformGuildData.name ?? platforms[PlatformType[platformId]].name}
              </Button>
            </Tooltip>
          )
        }
      >
        <AvailabilityTags rolePlatform={platform} />
      </RewardDisplay>

      <ClaimTextModal
        title={platformGuildData.name}
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        error={error}
        response={response}
      />
    </>
  )
}
export default SecretTextReward
