import { Icon, Spinner, Text, Tooltip } from "@chakra-ui/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import ClaimGatherModal from "platforms/Gather/ClaimGatherModal"
import useClaimGather from "platforms/Gather/hooks/useClaimGather"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import platforms from "platforms/platforms"
import { useMemo } from "react"
import { PlatformType } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"
import { useAccount } from "wagmi"

const GatherReward = ({ platform, withMotionImg }: RewardProps) => {
  const { platformId, platformGuildData } = platform.guildPlatform

  const {
    onSubmit,
    response: claimed,
    isLoading,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimGather(platform.id)

  const { roles } = useGuild()
  const role = roles.find((r) =>
    r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.guildPlatformId)
  )

  const { hasRoleAccess, isMember } = useRoleMembership(role.id)
  const { isConnected } = useAccount()
  const openJoinModal = useOpenJoinModal()

  const state = useMemo(() => {
    if (isMember && hasRoleAccess) {
      if (!getRolePlatformTimeframeInfo(platform).isAvailable && !claimed) {
        return {
          tooltipLabel: claimTextButtonTooltipLabel[getRolePlatformStatus(platform)],
          buttonProps: {
            isDisabled: true,
          },
        }
      }

      return {
        tooltipLabel: claimed ? "Go to space" : "Claim access",
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

  const spaceUrl = `https://app.gather.town/app/${platform.guildPlatform.platformGuildId.replace(
    "\\",
    "/"
  )}`

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
            <Text>
              {`Access space: `}
              <Tooltip label={state.tooltipLabel} hasArrow shouldWrapChildren>
                {claimed ? (
                  <Button
                    as="a"
                    variant="link"
                    target="_blank"
                    href={spaceUrl}
                    iconSpacing={1}
                    rightIcon={<ArrowSquareOut />}
                    maxW="full"
                  >
                    {platformGuildData.name ??
                      platforms[PlatformType[platformId]].name}
                  </Button>
                ) : (
                  <Button
                    variant="link"
                    maxW="full"
                    iconSpacing={1}
                    rightIcon={<ArrowSquareOut />}
                    isDisabled={state.buttonProps.isDisabled}
                    onClick={onOpen}
                  >
                    {platformGuildData.name ??
                      platforms[PlatformType[platformId]].name}
                  </Button>
                )}
              </Tooltip>
            </Text>
          )
        }
      >
        <AvailabilityTags rolePlatform={platform} />
      </RewardDisplay>

      <ClaimGatherModal
        title={platformGuildData.name}
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        onSubmit={onSubmit}
        claimed={claimed}
        gatherSpaceUrl={spaceUrl}
      />
    </>
  )
}
export default GatherReward
