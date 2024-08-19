import { Tooltip } from "@chakra-ui/react"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { RewardCardButton } from "rewards/components/RewardCardButton"
import { GuildPlatform, PlatformType, RolePlatformStatus } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"
import { useClaimedReward } from "../../hooks/useClaimedReward"
import useClaimText, { ClaimTextModal } from "./hooks/useClaimText"

type Props = {
  platform: GuildPlatform
}

export const claimTextButtonTooltipLabel: Record<
  RolePlatformStatus,
  string | undefined
> = {
  ALL_CLAIMED: "All available rewards have already been claimed",
  NOT_STARTED: "Claim hasn't started yet",
  ENDED: "Claim already ended",
  ACTIVE: undefined,
}

const TextCardButton = ({ platform }: Props) => {
  const { isAdmin } = useGuildPermission()
  const rolePlatform = useRolePlatform()

  const {
    onSubmit,
    isLoading,
    error,
    response,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimText(rolePlatform?.id)
  const { claimed } = useClaimedReward(rolePlatform?.id)

  const { isAvailable } = getRolePlatformTimeframeInfo(rolePlatform)
  const isButtonDisabled = !isAvailable && !claimed

  return (
    <>
      <Tooltip
        isDisabled={!isButtonDisabled}
        label={claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatform)]}
        hasArrow
        shouldWrapChildren
      >
        <RewardCardButton
          onClick={() => {
            onOpen()
            if (!response) onSubmit()
          }}
          isLoading={!rolePlatform || isLoading}
          loadingText={!rolePlatform ? "Loading..." : "Claiming secret..."}
          isDisabled={isButtonDisabled}
        >
          {platform.platformId === PlatformType.UNIQUE_TEXT
            ? "Claim"
            : "Reveal secret"}
        </RewardCardButton>
      </Tooltip>

      <ClaimTextModal
        title={platform.platformGuildData.name}
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        error={error}
        response={response}
      />
    </>
  )
}

export default TextCardButton
