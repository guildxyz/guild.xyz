import { Tooltip, useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import { useClaimedReward } from "hooks/useClaimedReward"
import dynamic from "next/dynamic"
import Link from "next/link"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import rewards from "platforms/rewards"
import { GuildPlatform } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"
import UploadMintLinksModal from "./UploadMintLinksModal"

const DynamicShowMintLinkButton = dynamic(() => import("./ShowMintLinkButton"), {
  ssr: false,
})

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

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const { isAvailable } = getRolePlatformTimeframeInfo(rolePlatform)
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const { claimed } = useClaimedReward(rolePlatform.id)

  return (
    <>
      <Tooltip
        isDisabled={isAvailable || claimed}
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        label={claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatform)]}
        hasArrow
        shouldWrapChildren
      >
        {claimed ? (
          <DynamicShowMintLinkButton
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
            rolePlatformId={rolePlatform.id}
            w="full"
            colorScheme={rewards.POAP.colorScheme}
          >
            Show mint link
          </DynamicShowMintLinkButton>
        ) : !rolePlatform?.capacity && isAdmin ? (
          <>
            <Button w="full" colorScheme={rewards.POAP.colorScheme} onClick={onOpen}>
              Upload mint links
            </Button>
            <UploadMintLinksModal
              isOpen={isOpen}
              onClose={onClose}
              // @ts-expect-error TODO: fix this error originating from strictNullChecks
              guildPlatformId={platform?.id}
            />
          </>
        ) : (
          <Button
            as={Link}
            // @ts-expect-error TODO: fix this error originating from strictNullChecks
            href={`/${urlName}/claim-poap/${platform.platformGuildData.fancyId}`}
            isDisabled={!isAvailable}
            w="full"
            colorScheme={rewards.POAP.colorScheme}
          >
            Claim POAP
          </Button>
        )}
      </Tooltip>
    </>
  )
}
export default PoapCardButton
