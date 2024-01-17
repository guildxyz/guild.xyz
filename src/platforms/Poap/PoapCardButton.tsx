import { Tooltip } from "@chakra-ui/react"
import { getTimeDiff } from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailibiltyTags"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
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

  return (
    <>
      <Tooltip
        isDisabled={!isButtonDisabled}
        label={tooltipLabel}
        hasArrow
        shouldWrapChildren
      >
        <LinkButton
          href={`/${urlName}/collect-poap/${platform.platformGuildData.fancyId}`}
          isDisabled={isButtonDisabled}
          w="full"
          colorScheme={platforms.POAP.colorScheme}
        >
          {!rolePlatform?.capacity && isAdmin ? "Upload mint links" : "Claim POAP"}
        </LinkButton>
      </Tooltip>
    </>
  )
}
export default PoapCardButton
