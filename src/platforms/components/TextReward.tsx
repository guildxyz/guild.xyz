import { Icon, Spinner, Text, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import platforms from "platforms/platforms"
import useClaimText, {
  ClaimTextModal,
} from "platforms/SecretText/hooks/useClaimText"
import { useMemo } from "react"
import { PlatformType } from "types"

const SecretTextReward = ({ platform, withMotionImg }: RewardProps) => {
  const { platformId, platformGuildData } = platform.guildPlatform

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
  const { hasAccess, isValidating: isAccessValidating } = useAccess(role.id)
  const { account } = useWeb3React()
  const openJoinModal = useOpenJoinModal()

  const label = platformId === PlatformType.TEXT ? "Reveal secret" : "Claim"

  const state = useMemo(() => {
    if (isMember && hasAccess)
      return {
        tooltipLabel: label,
        buttonProps: {},
      }
    if (!account || (!isMember && hasAccess))
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
  }, [isMember, hasAccess, account])

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
      />

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
