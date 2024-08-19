import { Tooltip } from "@chakra-ui/react"
import { ArrowRight } from "@phosphor-icons/react"
import { RewardIcon } from "components/[guild]/RoleCard/components/Reward"
import { RewardDisplay } from "components/[guild]/RoleCard/components/RewardDisplay"
import { RewardProps } from "components/[guild]/RoleCard/components/types"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { useClaimedReward } from "hooks/useClaimedReward"
import dynamic from "next/dynamic"
import Link from "next/link"
import rewards from "rewards"
import { claimTextButtonTooltipLabel } from "rewards/SecretText/TextCardButton"
import { PlatformType } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"

const DynamicShowMintLinkButton = dynamic(
  () => import("rewards/Poap/ShowMintLinkButton"),
  {
    ssr: false,
  }
)

const PoapReward = ({ platform: platform }: RewardProps) => {
  const { platformId, platformGuildData } = platform.guildPlatform
  const { urlName } = useGuild()
  const { claimed } = useClaimedReward(platform.id)

  const { isAvailable } = getRolePlatformTimeframeInfo(platform)

  return (
    <RewardDisplay
      icon={
        <RewardIcon
          rolePlatformId={platform.id}
          guildPlatform={platform?.guildPlatform}
        />
      }
      label={
        <Tooltip
          isDisabled={claimed}
          label={
            isAvailable
              ? "View POAP"
              : claimTextButtonTooltipLabel[getRolePlatformStatus(platform)]
          }
          hasArrow
          shouldWrapChildren
        >
          {claimed ? (
            <>
              {"Mint link: "}
              <DynamicShowMintLinkButton
                rolePlatformId={platform.id}
                variant="link"
                colorScheme="primary"
                maxW="full"
              >
                {platformGuildData.name ?? rewards[PlatformType[platformId]].name}
              </DynamicShowMintLinkButton>
            </>
          ) : (
            <>
              {"Claim: "}
              <Button
                as={Link}
                href={`/${urlName}/claim-poap/${platformGuildData.fancyId}`}
                variant="link"
                colorScheme="primary"
                rightIcon={<ArrowRight />}
                iconSpacing="1"
                maxW="full"
                isDisabled={!isAvailable}
                prefetch={false}
              >
                {platformGuildData.name ?? rewards[PlatformType[platformId]].name}
              </Button>
            </>
          )}
        </Tooltip>
      }
    >
      <AvailabilityTags rolePlatform={platform} />
    </RewardDisplay>
  )
}
export default PoapReward
