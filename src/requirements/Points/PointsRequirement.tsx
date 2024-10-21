import { Anchor } from "@/components/ui/Anchor"
import { Skeleton } from "@/components/ui/Skeleton"
import { GuildReward } from "@guildxyz/types"
import {
  Requirement,
  RequirementProps,
  RequirementSkeleton,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useGuild, { useSimpleGuild } from "components/[guild]/hooks/useGuild"
import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import Star from "static/icons/star.svg"
import useSWRImmutable from "swr/immutable"

type PointsRequirementTypes = "POINTS_AMOUNT" | "POINTS_TOTAL_AMOUNT" | "POINTS_RANK"

const ExternalGuildLink = ({ name, urlName }: { name: string; urlName: string }) => (
  <>
    <span>{" in the "}</span>
    {!name ? (
      <Skeleton className="inline-block h-5 w-40" />
    ) : (
      <Anchor href={urlName} variant="highlighted" showExternal target="_blank">
        {name}
      </Anchor>
    )}
    <span>{" guild"}</span>
  </>
)

const PointsRank = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<PointsRequirementTypes>()
  const { guildId, minAmount, maxAmount } = requirement.data
  const { name, urlName } = useSimpleGuild(guildId)
  const { id: currentGuildId } = useGuild()

  const pointsReward = usePointsRewardForCurrentRequirement()

  if (!pointsReward) return <RequirementSkeleton />

  return (
    <Requirement
      image={pointsReward.platformGuildData?.imageUrl ?? <Star />}
      {...props}
    >
      <span>
        {minAmount
          ? `Have a rank between ${minAmount} - ${maxAmount} on the `
          : `Be in the top ${maxAmount ?? ""} members on the `}
      </span>
      <Anchor
        href={`/${urlName}/leaderboard/${pointsReward.id}`}
        variant="highlighted"
        showExternal
        target="_blank"
      >{`${pointsReward.platformGuildData?.name ?? "Unknown"} leaderboard`}</Anchor>
      {guildId !== currentGuildId && <ExternalGuildLink {...{ name, urlName }} />}
    </Requirement>
  )
}

const PointsTotalAmount = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<PointsRequirementTypes>()
  const { guildId, minAmount, maxAmount } = requirement.data
  const { name, urlName } = useSimpleGuild(guildId)
  const { id: currentGuildId } = useGuild()

  return (
    <Requirement image={<Star />} {...props}>
      <span>
        {maxAmount
          ? `Have a total score between ${minAmount} - ${maxAmount} summing all point types`
          : `Have a total score of at least ${minAmount} summing all point types`}
      </span>
      {guildId !== currentGuildId && <ExternalGuildLink {...{ name, urlName }} />}
    </Requirement>
  )
}

const PointsAmount = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<PointsRequirementTypes>()
  const { guildId, minAmount, maxAmount } = requirement.data
  const { name, urlName } = useSimpleGuild(guildId)
  const { id: currentGuildId } = useGuild()

  const pointsReward = usePointsRewardForCurrentRequirement()

  if (!pointsReward) return <RequirementSkeleton />

  const pointsName = pointsReward.platformGuildData?.name || "points"

  return (
    <Requirement
      image={pointsReward.platformGuildData?.imageUrl ?? <Star />}
      {...props}
    >
      <span>
        {maxAmount
          ? `Have between ${minAmount} - ${maxAmount} ${pointsName}`
          : `Have at least ${minAmount} ${pointsName}`}
      </span>
      {guildId !== currentGuildId && <ExternalGuildLink {...{ name, urlName }} />}
    </Requirement>
  )
}

const usePointsRewardForCurrentRequirement = () => {
  const {
    data: { guildPlatformId, guildId },
  } = useRequirementContext<Exclude<PointsRequirementTypes, "POINTS_TOTAL_AMOUNT">>()

  const { id: currentGuildId } = useGuild()
  const { guildPlatform: pointsRewardInCurrentGuild } =
    useGuildPlatform(guildPlatformId)

  const { data: externalGuildPlatforms } = useSWRImmutable<GuildReward[]>(
    guildId !== currentGuildId ? `/v2/guilds/${guildId}/guild-platforms` : null
  )

  const pointsReward =
    pointsRewardInCurrentGuild ??
    externalGuildPlatforms?.find((gp) => gp.id === guildPlatformId)

  return pointsReward
}

const types = {
  POINTS_AMOUNT: PointsAmount,
  POINTS_TOTAL_AMOUNT: PointsTotalAmount,
  POINTS_RANK: PointsRank,
}

const PointsRequirement = (props: RequirementProps) => {
  const { type } = useRequirementContext<PointsRequirementTypes>()
  const Component = types[type]
  return <Component {...props} />
}

export default PointsRequirement
