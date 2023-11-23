import { Tooltip } from "@chakra-ui/react"
import { getTimeDiff } from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailibiltyTags"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { GuildPlatform, PlatformType } from "types"
import useClaimText, { ClaimTextModal } from "./hooks/useClaimText"

type Props = {
  platform: GuildPlatform
}

const TextCardButton = ({ platform }: Props) => {
  const { roles } = useGuild()
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

  const startTimeDiff = getTimeDiff(rolePlatform?.startTime)
  const endTimeDiff = getTimeDiff(rolePlatform?.endTime)

  const isButtonDisabled =
    startTimeDiff > 0 ||
    endTimeDiff < 0 ||
    (typeof rolePlatform?.capacity === "number" &&
      rolePlatform?.capacity === rolePlatform?.claimedCount)

  const tooltipLabel =
    typeof rolePlatform?.capacity === "number" &&
    rolePlatform?.capacity === rolePlatform?.claimedCount
      ? "All available rewards have already been claimed"
      : startTimeDiff > 0
      ? "Claim hasn't started yet"
      : "Claim already ended"

  return (
    <>
      <Tooltip
        isDisabled={!isButtonDisabled}
        label={tooltipLabel}
        hasArrow
        shouldWrapChildren
      >
        <Button
          onClick={() => {
            onOpen()
            if (!response) onSubmit()
          }}
          isLoading={isLoading}
          loadingText="Claiming secret..."
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
      />
    </>
  )
}

export default TextCardButton
