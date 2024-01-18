import { ButtonProps, Tooltip } from "@chakra-ui/react"
import { getTimeDiff } from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import LinkButton from "components/common/LinkButton"
import platforms from "platforms/platforms"
import { GuildPlatform } from "types"

type Props = {
  platform: GuildPlatform
}

const PoapCardButton = ({ platform }: Props) => {
  const { urlName, roles } = useGuild()
  const { isAdmin } = useGuildPermission()

  const rolePlatform = roles
    ?.find((r) => r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.id))
    ?.rolePlatforms?.find((rp) => rp.guildPlatformId === platform?.id)

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
      ? "All available POAPs have already been claimed"
      : startTimeDiff > 0
      ? "Claim hasn't started yet"
      : "Claim already ended"

  const buttonLabel =
    !rolePlatform?.capacity && isAdmin ? "Upload mint links" : "Claim POAP"

  const buttonProps: Omit<ButtonProps, "as"> = {
    isDisabled: isButtonDisabled,
    w: "full",
    colorScheme: platforms.POAP.colorScheme,
  }

  return (
    <>
      <Tooltip
        isDisabled={!isButtonDisabled}
        label={tooltipLabel}
        hasArrow
        shouldWrapChildren
      >
        {isButtonDisabled ? (
          <Button {...buttonProps}>{buttonLabel}</Button>
        ) : (
          <LinkButton
            href={`/${urlName}/claim-poap/${platform.platformGuildData.fancyId}`}
            {...buttonProps}
          >
            {buttonLabel}
          </LinkButton>
        )}
      </Tooltip>
    </>
  )
}
export default PoapCardButton
