import { Icon, Spinner, Text, Tooltip } from "@chakra-ui/react"
import { ArrowSquareOut, LockSimple } from "@phosphor-icons/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { RewardIcon } from "components/[guild]/RoleCard/components/Reward"
import { RewardDisplay } from "components/[guild]/RoleCard/components/RewardDisplay"
import { RewardProps } from "components/[guild]/RoleCard/components/types"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { useMemo } from "react"
import rewards from "rewards"
import ClaimGatherModal from "rewards/Gather/ClaimGatherModal"
import useClaimGather from "rewards/Gather/hooks/useClaimGather"
import { claimTextButtonTooltipLabel } from "rewards/SecretText/TextCardButton"
import { PlatformType } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"

const GatherReward = ({ platform }: RewardProps) => {
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
  const openJoinModal = useOpenJoinModal()

  const state = useMemo(() => {
    if (hasRoleAccess) {
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

    if (!isMember)
      return {
        tooltipLabel: (
          <>
            <Icon as={LockSimple} display="inline" mb="-2px" mr="1" />
            Join guild to check access
          </>
        ),
        buttonProps: { onClick: openJoinModal },
      }

    return {
      tooltipLabel: "You don't satisfy the requirements to this role",
      buttonProps: { isDisabled: true },
    }
  }, [hasRoleAccess, platform, claimed, isMember, openJoinModal])

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
                      rewards[PlatformType[platformId]].name}
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
                      rewards[PlatformType[platformId]].name}
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
