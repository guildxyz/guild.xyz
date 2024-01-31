import { ButtonProps, Tooltip } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import LinkButton from "components/common/LinkButton"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import platforms from "platforms/platforms"
import { GuildPlatform } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"

type Props = {
  platform: GuildPlatform
}

const PoapCardButton = ({ platform }: Props) => {
  const { urlName, roles } = useGuild()
  const { isAdmin } = useGuildPermission()

  const rolePlatform = roles
    ?.find((r) => r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.id))
    ?.rolePlatforms?.find((rp) => rp.guildPlatformId === platform?.id)

  const { inActiveTimeframe: isButtonDisabled } =
    getRolePlatformTimeframeInfo(rolePlatform)

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
        label={claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatform)]}
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
