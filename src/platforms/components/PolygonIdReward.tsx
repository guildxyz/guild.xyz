import { Spinner, Text, Tooltip } from "@chakra-ui/react"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import AvailibiltyTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailibiltyTags"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"
import useMintPolygonIdProof, {
  MintPolygonIdProofModal,
} from "platforms/PolygonId/hooks/useMintPolygonIdProof"
import platforms from "platforms/platforms"
import { PlatformType } from "types"

const PolygonIdReward = ({ platform, withMotionImg }: RewardProps) => {
  const { platformId, platformGuildData } = platform.guildPlatform

  const {
    isLoading,
    roles,
    modalProps: { isOpen, onOpen, onClose },
  } = useMintPolygonIdProof()
  /* const { roles } = useGuild()
  const role = roles.find((r) =>
    r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.guildPlatformId)
  )

  const isMember = useIsMember()
  const { hasAccess, isValidating: isAccessValidating } = useAccess(role.id)
  const { isConnected } = useAccount()
  const openJoinModal = useOpenJoinModal()

  const state = useMemo(() => {
    if (isMember && hasAccess) {
      const startTimeDiff = getTimeDiff(platform?.startTime)
      const endTimeDiff = getTimeDiff(platform?.endTime)

      if (
        startTimeDiff > 0 ||
        endTimeDiff < 0 ||
        (typeof platform?.capacity === "number" &&
          platform?.capacity === platform?.claimedCount)
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

    if (!isConnected || (!isMember && hasAccess))
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
  }, [isMember, hasAccess, isConnected, platform])*/

  const state = {
    tooltipLabel: "Mint proofs",
  }

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
            <Text opacity={0.5}>Loading reward...</Text>
          ) : (
            <Tooltip label={state.tooltipLabel} hasArrow shouldWrapChildren>
              {`Mint: `}
              <Button
                variant="link"
                rightIcon={false ? <Spinner boxSize="1em" /> : <ArrowSquareOut />}
                iconSpacing="1"
                maxW="full"
                onClick={onOpen}
              >
                {platforms[PlatformType[platformId]].name} proof
              </Button>
            </Tooltip>
          )
        }
      >
        <AvailibiltyTags rolePlatform={platform} />
      </RewardDisplay>

      <MintPolygonIdProofModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        roles={roles}
      />
    </>
  )
}
export default PolygonIdReward
