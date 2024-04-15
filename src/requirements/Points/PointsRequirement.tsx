import { Link } from "@chakra-ui/next-js"
import { Skeleton } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
  RequirementSkeleton,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useGuild from "components/[guild]/hooks/useGuild"
import Star from "static/icons/star.svg"

const ExternalGuildLink = ({ name, urlName }) => (
  <>
    {` in the `}
    <Skeleton display="inline" isLoaded={!!name}>
      <Link colorScheme="blue" fontWeight="medium" href={urlName} isExternal>
        {name ?? "Loading..."}
      </Link>
    </Skeleton>
    {` guild`}
  </>
)

const PointsRank = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const { guildPlatformId, guildId, minAmount, maxAmount } = requirement.data
  const { name, urlName, guildPlatforms } = useGuild(guildId)
  const { id: currentGuildId } = useGuild()

  const pointsReward = guildPlatforms?.find((gp) => gp.id === guildPlatformId)

  if (!pointsReward) return <RequirementSkeleton />

  return (
    <Requirement
      image={pointsReward.platformGuildData.imageUrl ?? <Star />}
      {...props}
    >
      {minAmount
        ? `Have a rank between ${minAmount} - ${maxAmount} on the `
        : `Be in the top ${maxAmount} members on the `}
      <Link
        colorScheme={"blue"}
        fontWeight={"medium"}
        href={`/${urlName}/leaderboard/${pointsReward.id}`}
      >{`${pointsReward.platformGuildData.name} leaderboard`}</Link>
      {guildId !== currentGuildId && <ExternalGuildLink {...{ name, urlName }} />}
    </Requirement>
  )
}

const PointsTotalAmount = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const { guildId, minAmount, maxAmount } = requirement.data
  const { name, urlName } = useGuild(guildId)
  const { id: currentGuildId } = useGuild()

  return (
    <Requirement image={<Star />} {...props}>
      {maxAmount
        ? `Have a total score between ${minAmount} - ${maxAmount} summing all point types`
        : `Have a total score of at least ${minAmount} summing all point types`}
      {guildId !== currentGuildId && <ExternalGuildLink {...{ name, urlName }} />}
    </Requirement>
  )
}

const PointsAmount = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const { guildPlatformId, guildId, minAmount, maxAmount } = requirement.data
  const { name, urlName, guildPlatforms } = useGuild(guildId)
  const { id: currentGuildId } = useGuild()

  const pointsReward = guildPlatforms?.find((gp) => gp.id === guildPlatformId)

  if (!pointsReward) return <RequirementSkeleton />

  const pointsName = pointsReward.platformGuildData.name || "points"

  return (
    <Requirement
      image={pointsReward.platformGuildData.imageUrl ?? <Star />}
      {...props}
    >
      {maxAmount
        ? `Have between ${minAmount} - ${maxAmount} ${pointsName}`
        : `Have at least ${minAmount} ${pointsName}`}
      {guildId !== currentGuildId && <ExternalGuildLink {...{ name, urlName }} />}
    </Requirement>
  )
}

const types = {
  POINTS_AMOUNT: PointsAmount,
  POINTS_TOTAL_AMOUNT: PointsTotalAmount,
  POINTS_RANK: PointsRank,
}

const PointsRequirement = (props: RequirementProps) => {
  const { type } = useRequirementContext()
  const Component = types[type]
  return <Component {...props} />
}

export default PointsRequirement
