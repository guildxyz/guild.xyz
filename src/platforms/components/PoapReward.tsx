import { Tooltip } from "@chakra-ui/react"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import AvailabilityTags, {
  getTimeDiff,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { ArrowRight } from "phosphor-react"
import platforms from "platforms/platforms"
import { useMemo } from "react"
import { PlatformType } from "types"

const PoapReward = ({ platform, withMotionImg }: RewardProps) => {
  const { platformId, platformGuildData } = platform.guildPlatform
  const { urlName } = useGuild()

  const state = useMemo(() => {
    const startTimeDiff = getTimeDiff(platform?.startTime)
    const endTimeDiff = getTimeDiff(platform?.endTime)

    if (
      startTimeDiff > 0 ||
      endTimeDiff < 0 ||
      (typeof platform?.capacity === "number" &&
        platform?.capacity === platform?.claimedCount)
    )
      return {
        tooltipLabel:
          platform?.capacity === platform?.claimedCount
            ? "All available POAPs have already been claimed"
            : startTimeDiff > 0
            ? "Claim hasn't started yet"
            : "Claim already ended",
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
