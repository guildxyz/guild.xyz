import { Tooltip } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import { GuildPlatform } from "types"
import { getRolePlatformStatus } from "utils/rolePlatformHelpers"

type Props = {
  platform: GuildPlatform
}

const TokenCardButton = ({ platform }: Props) => {
  const claimed = false

  const { roles } = useGuild()
  const rolePlatform = roles
    ?.find((r) => r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.id))
    ?.rolePlatforms?.find((rp) => rp.guildPlatformId === platform?.id)

  return (
    <>
      <Tooltip
        label={claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatform)]}
        hasArrow
        shouldWrapChildren
        w="full"
      >
        <Button colorScheme="GATHER_TOWN" w="full" isDisabled={claimed}>
          Claim
        </Button>
      </Tooltip>
    </>
  )
}

export default TokenCardButton
