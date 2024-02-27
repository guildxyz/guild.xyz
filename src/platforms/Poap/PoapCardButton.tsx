import { Tooltip, useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import { useClaimedReward } from "hooks/useClaimedReward"
import Link from "next/link"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import platforms from "platforms/platforms"
import { GuildPlatform } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"
import { ShowMintLinkButton } from "./ShowMintLinkButton"
import UploadMintLinksModal from "./UploadMintLinksModal"

type Props = {
  platform: GuildPlatform
}

const PoapCardButton = ({ platform }: Props) => {
  const { urlName, roles } = useGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isAdmin } = useGuildPermission()

  const rolePlatform = roles
    ?.find((r) => r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.id))
    ?.rolePlatforms?.find((rp) => rp.guildPlatformId === platform?.id)

  const { isAvailable } = getRolePlatformTimeframeInfo(rolePlatform)
  const { claimed } = useClaimedReward(rolePlatform.id)

  return (
    <>
      <Tooltip
        isDisabled={isAvailable || claimed}
        label={claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatform)]}
        hasArrow
        shouldWrapChildren
      >
        {claimed ? (
          <ShowMintLinkButton
            rolePlatformId={rolePlatform.id}
            w="full"
            colorScheme={platforms.POAP.colorScheme}
          >
            Show mint link
          </ShowMintLinkButton>
        ) : !rolePlatform?.capacity && isAdmin ? (
          <>
            <Button
              w="full"
              colorScheme={platforms.POAP.colorScheme}
              onClick={onOpen}
            >
              Upload mint links
            </Button>
            <UploadMintLinksModal
              isOpen={isOpen}
              onClose={onClose}
              guildPlatformId={platform?.id}
              platformGuildData={platform?.platformGuildData}
            />
          </>
        ) : (
          <Button
            as={Link}
            href={`/${urlName}/claim-poap/${platform.platformGuildData.fancyId}`}
            isDisabled={!isAvailable}
            w="full"
            colorScheme={platforms.POAP.colorScheme}
          >
            Claim POAP
          </Button>
        )}
      </Tooltip>
    </>
  )
}
export default PoapCardButton
