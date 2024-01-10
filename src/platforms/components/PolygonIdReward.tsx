import { Icon, Spinner, Tooltip, useDisclosure } from "@chakra-ui/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
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
  const { platformId } = platform.guildPlatform
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { roles } = useGuild()
  const role = roles.find((r) =>
    r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.guildPlatformId)
  )

  const isMember = useIsMember()
  const { hasAccess } = useAccess(role.id)
  const { isConnected } = useAccount()
  const openJoinModal = useOpenJoinModal()

  const state = useMemo(() => {
    if (isMember && hasAccess) {
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
              {platforms[PlatformType[platformId]].name} proofs
            </Button>
          </Tooltip>
        }
      />
      <MintPolygonIdProofModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default PolygonIdReward
