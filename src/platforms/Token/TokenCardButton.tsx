import { Tooltip, useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import { GuildPlatform } from "types"
import { getRolePlatformStatus } from "utils/rolePlatformHelpers"
import ClaimTokenModal from "./ClaimTokenModal"

type Props = {
  platform: GuildPlatform
}

const TokenCardButton = ({ platform }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
        <Button colorScheme="primary" w="full" isDisabled={claimed} onClick={onOpen}>
          Claim
        </Button>
      </Tooltip>

      <ClaimTokenModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default TokenCardButton
