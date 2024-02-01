import { Tooltip } from "@chakra-ui/react"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { ArrowRight } from "phosphor-react"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import platforms from "platforms/platforms"
import { useMemo } from "react"
import { PlatformType } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"

const PoapReward = ({ platform, withMotionImg }: RewardProps) => {
  const { platformId, platformGuildData } = platform.guildPlatform
  const { urlName } = useGuild()

  const state = useMemo(() => {
    if (!getRolePlatformTimeframeInfo(platform).isAvailable)
      return {
        tooltipLabel: claimTextButtonTooltipLabel[getRolePlatformStatus(platform)],
        buttonProps: {
          isDisabled: true,
        },
      }

    return {
      tooltipLabel: "View POAP",
      buttonProps: {},
    }
  }, [platform])

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
        <Tooltip label={state.tooltipLabel} hasArrow shouldWrapChildren>
          {"Claim: "}
          <LinkButton
            href={`/${urlName}/claim-poap/${platformGuildData.fancyId}`}
            variant="link"
            rightIcon={<ArrowRight />}
            iconSpacing="1"
            maxW="full"
            {...state.buttonProps}
          >
            {platformGuildData.name ?? platforms[PlatformType[platformId]].name}
          </LinkButton>
        </Tooltip>
      }
    >
      <AvailabilityTags rolePlatform={platform} />
    </RewardDisplay>
  )
}
export default PoapReward
