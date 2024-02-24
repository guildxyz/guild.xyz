import { Tooltip } from "@chakra-ui/react"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { useClaimedReward } from "hooks/useClaimedReward"
import Link from "next/link"
import { ArrowRight } from "phosphor-react"
import { ShowMintLinkButton } from "platforms/Poap/ShowMintLinkButton"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import platforms from "platforms/platforms"
import { PlatformType } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"

const PoapReward = ({ platform: platform, withMotionImg }: RewardProps) => {
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
          withMotionImg={withMotionImg}
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
              <ShowMintLinkButton
                rolePlatformId={platform.id}
                variant="link"
                colorScheme="primary"
                maxW="full"
              >
                {platformGuildData.name ?? platforms[PlatformType[platformId]].name}
              </ShowMintLinkButton>
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
              >
                {platformGuildData.name ?? platforms[PlatformType[platformId]].name}
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
