import { ModalFooter, Text, Tooltip } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
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
  const { roles } = useGuild()
  const { isAdmin } = useGuildPermission()

  const rolePlatform = roles
    ?.find((r) => r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.id))
    ?.rolePlatforms?.find((rp) => rp.guildPlatformId === platform?.id)
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
        <Button
          onClick={() => {
            onOpen()
            if (!response) onSubmit()
          }}
          isLoading={!rolePlatform || isLoading}
          loadingText={!rolePlatform ? "Loading..." : "Claiming secret..."}
          isDisabled={isButtonDisabled}
          w="full"
        >
          {platform.platformId === PlatformType.UNIQUE_TEXT
            ? "Claim"
            : "Reveal secret"}
        </Button>
      </Tooltip>

      <ClaimTextModal
        title={platform.platformGuildData.name}
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        error={error}
        response={response}
      >
        {!isAdmin && response?.uniqueValue && !claimed && (
          <ModalFooter pt="5" pb="6" px="7">
            <Text colorScheme="gray" fontSize={"sm"}>
              By refreshing, the reward will disappear from the highlighted cards at
              the top of the guild, but you will still be able to access it from it's
              role anytime
            </Text>
          </ModalFooter>
        )}
      </ClaimTextModal>
    </>
  )
}

export default TextCardButton
