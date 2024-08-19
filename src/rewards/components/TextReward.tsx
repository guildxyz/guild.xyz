import { Icon, Spinner, Text, Tooltip } from "@chakra-ui/react"
import { ArrowSquareIn, LockSimple } from "@phosphor-icons/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { RewardIcon } from "components/[guild]/RoleCard/components/Reward"
import { RewardDisplay } from "components/[guild]/RoleCard/components/RewardDisplay"
import { RewardProps } from "components/[guild]/RoleCard/components/types"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import useMembership, {
  useRoleMembership,
} from "components/explorer/hooks/useMembership"
import { useMemo } from "react"
import rewards from "rewards"
import { claimTextButtonTooltipLabel } from "rewards/SecretText/TextCardButton"
import useClaimText, { ClaimTextModal } from "rewards/SecretText/hooks/useClaimText"
import { PlatformType } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"
import { useClaimedReward } from "../../hooks/useClaimedReward"

const SecretTextReward = ({ platform }: RewardProps) => {
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

  const { isMember } = useMembership()
  const { hasRoleAccess, isValidating: isAccessValidating } = useRoleMembership(
    role.id
  )
  const openJoinModal = useOpenJoinModal()

  const label = platformId === PlatformType.TEXT ? "Reveal secret" : "Claim"

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
        tooltipLabel: label,
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
  }, [hasRoleAccess, platform, claimed, label, isMember, openJoinModal])

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
            <Tooltip label={state.tooltipLabel} hasArrow shouldWrapChildren>
              {`${label}: `}
              <Button
                variant="link"
                rightIcon={
                  isAccessValidating ? <Spinner boxSize="1em" /> : <ArrowSquareIn />
                }
                iconSpacing="1"
                maxW="full"
                onClick={() => {
                  onOpen()
                  if (!response) onSubmit()
                }}
                {...state.buttonProps}
              >
                {platformGuildData.name ?? rewards[PlatformType[platformId]].name}
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
