import { Icon, Spinner, Tooltip } from "@chakra-ui/react"
import { ArrowSquareIn, LockSimple } from "@phosphor-icons/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { RewardIcon } from "components/[guild]/RoleCard/components/Reward"
import { RewardDisplay } from "components/[guild]/RoleCard/components/RewardDisplay"
import { RewardProps } from "components/[guild]/RoleCard/components/types"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import useMembership, {
  useRoleMembership,
} from "components/explorer/hooks/useMembership"
import { useMemo } from "react"
import rewards from "rewards"
import { useMintPolygonIDProofContext } from "rewards/PolygonID/components/MintPolygonIDProofProvider"
import useConnectedDID from "rewards/PolygonID/hooks/useConnectedDID"
import { PlatformType } from "types"

const PolygonIDReward = ({ platform }: RewardProps) => {
  const { platformId } = platform.guildPlatform

  const { roles } = useGuild()
  const role = roles.find((r) =>
    r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.guildPlatformId)
  )

  const { isMember } = useMembership()
  const { hasRoleAccess, isValidating } = useRoleMembership(role.id)
  const openJoinModal = useOpenJoinModal()

  const { onConnectDIDModalOpen, onMintPolygonIDProofModalOpen } =
    useMintPolygonIDProofContext()
  const { isLoading, data: connectedDID } = useConnectedDID()

  const state = useMemo(() => {
    if (hasRoleAccess && connectedDID) {
      return {
        tooltipLabel: "Mint proof",
        buttonProps: {
          isDisabled: isLoading || isValidating,
          onClick: onMintPolygonIDProofModalOpen,
        },
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

    if (!connectedDID)
      return {
        tooltipLabel: "Connect DID",
        buttonProps: { onClick: onConnectDIDModalOpen },
      }

    return {
      tooltipLabel: "You don't satisfy the requirements to this role",
      buttonProps: { isDisabled: true },
    }
  }, [
    hasRoleAccess,
    connectedDID,
    isLoading,
    isValidating,
    onMintPolygonIDProofModalOpen,
    isMember,
    openJoinModal,
    onConnectDIDModalOpen,
  ])

  return (
    <RewardDisplay
      icon={
        <RewardIcon
          rolePlatformId={platform.id}
          guildPlatform={platform?.guildPlatform}
        />
      }
      label={
        <Tooltip label={state.tooltipLabel} hasArrow shouldWrapChildren>
          {`Mint: `}
          <Button
            variant="link"
            rightIcon={
              isLoading || isValidating ? (
                <Spinner boxSize="1em" />
              ) : (
                <ArrowSquareIn />
              )
            }
            iconSpacing="1"
            maxW="full"
            {...state.buttonProps}
          >
            {rewards[PlatformType[platformId]].name} proofs
          </Button>
        </Tooltip>
      }
    />
  )
}
export default PolygonIDReward
