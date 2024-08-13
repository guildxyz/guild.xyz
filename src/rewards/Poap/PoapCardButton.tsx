import { Tooltip, useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { useClaimedReward } from "hooks/useClaimedReward"
import dynamic from "next/dynamic"
import Link from "next/link"
import rewards from "rewards"
import { claimTextButtonTooltipLabel } from "rewards/SecretText/TextCardButton"
import { RewardCardButton } from "rewards/components/RewardCardButton"
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
          <DynamicShowMintLinkButton
            rolePlatformId={rolePlatform.id}
            colorScheme={rewards.POAP.colorScheme}
          >
            Show mint link
          </DynamicShowMintLinkButton>
        ) : !rolePlatform?.capacity && isAdmin ? (
          <>
            <RewardCardButton
              colorScheme={rewards.POAP.colorScheme}
              onClick={onOpen}
            >
              Upload mint links
            </RewardCardButton>
            <UploadMintLinksModal
              isOpen={isOpen}
              onClose={onClose}
              guildPlatformId={platform?.id}
            />
          </>
        ) : (
          <RewardCardButton
            as={Link}
            href={`/${urlName}/claim-poap/${platform.platformGuildData.fancyId}`}
            isDisabled={!isAvailable}
            colorScheme={rewards.POAP.colorScheme}
          >
            Claim POAP
          </RewardCardButton>
        )}
      </Tooltip>
    </>
  )
}
export default PoapCardButton
