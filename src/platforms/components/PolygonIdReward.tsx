import { Icon, Spinner, Tooltip, useDisclosure } from "@chakra-ui/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import AvailibiltyTags, {
  getTimeDiff,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailibiltyTags"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import Button from "components/common/Button"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import { MintPolygonIdProofModal } from "platforms/PolygonId/components/MintPolygonIdProofModal"
import platforms from "platforms/platforms"
import { useMemo } from "react"
import { PlatformType } from "types"
import { useAccount } from "wagmi"

const PolygonIdReward = ({ platform, withMotionImg }: RewardProps) => {
  const { platformId, platformGuildData } = platform.guildPlatform
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { roles } = useGuild()
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
        tooltipLabel: "Mint",
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
  }, [isMember, hasAccess, isConnected, platform])

  return (
    <>
      <RewardDisplay
        icon={
          <RewardIcon
            rolePlatformId={platform.id}
            guildPlatform={platform?.guildPlatform}
            withMotionImg={withMotionImg}
          />
        }
        label={
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
        }
      >
        <AvailibiltyTags rolePlatform={platform} />
      </RewardDisplay>

      <MintPolygonIdProofModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default PolygonIdReward
