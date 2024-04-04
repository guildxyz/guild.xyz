import { Icon, Link } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import { ArrowSquareOut } from "phosphor-react"
import REQUIREMENTS from "requirements"
import FarcasterCast from "./components/FarcasterCast"
import useFarcasterCast from "./hooks/useFarcasterCast"
import { useFarcasterChannel } from "./hooks/useFarcasterChannels"
import { useFarcasterUser } from "./hooks/useFarcasterUsers"

const FarcasterProfile = (props: RequirementProps) => (
  <Requirement image={REQUIREMENTS.FARCASTER.icon.toString()} {...props}>
    Have a Farcaster profile
  </Requirement>
)

const FarcasterFollowUser = (props: RequirementProps) => {
  const { data, type } = useRequirementContext()

  const { data: farcasterUser } = useFarcasterUser(
    ["FARCASTER_FOLLOW", "FARCASTER_FOLLOWED_BY"].includes(type)
      ? data?.id
      : undefined
  )

  return (
    <Requirement
      image={farcasterUser?.img || "/requirementLogos/farcaster.png"}
      {...props}
    >
      {type === "FARCASTER_FOLLOW" ? "Follow " : "Be followed by "}
      <DataBlock isLoading={!farcasterUser}>
        {farcasterUser?.label ?? "Loading..."}
      </DataBlock>
      {" on Farcaster"}
    </Requirement>
  )
}

const FarcasterTotalFollowers = (props: RequirementProps) => {
  const { data } = useRequirementContext()

  return (
    <Requirement image={REQUIREMENTS.FARCASTER.icon.toString()} {...props}>
      {`Have at least ${data.min} followers on Farcaster`}
    </Requirement>
  )
}

const FarcasterLikeRecast = (props: RequirementProps) => {
  const { data, type } = useRequirementContext()

  const {
    data: cast,
    isLoading: isCastLoading,
    error: castError,
  } = useFarcasterCast(data?.hash)

  return (
    <Requirement image={REQUIREMENTS.FARCASTER.icon.toString()} {...props}>
      {type === "FARCASTER_LIKE" ? "Like" : "Recast"}
      <>
        {" this cast: "}
        <FarcasterCast
          size="sm"
          cast={cast}
          loading={isCastLoading}
          error={castError}
        />
      </>
    </Requirement>
  )
}

const FarcasterFollowChannel = (props: RequirementProps) => {
  const { data } = useRequirementContext()
  const { data: farcasterChannel } = useFarcasterChannel(data?.id)

  return (
    <Requirement image={REQUIREMENTS.FARCASTER.icon.toString()} {...props}>
      {"Follow the "}
      <Link
        href={`https://warpcast.com/~/channel/${data.id}`}
        isExternal
        colorScheme="blue"
        fontWeight="medium"
      >
        {farcasterChannel?.label ?? data.id}
        <Icon as={ArrowSquareOut} mx="1" />
      </Link>
      {" channel on Farcaster"}
    </Requirement>
  )
}

const types = {
  FARCASTER_PROFILE: FarcasterProfile,
  FARCASTER_FOLLOW: FarcasterFollowUser,
  FARCASTER_FOLLOWED_BY: FarcasterFollowUser,
  FARCASTER_TOTAL_FOLLOWERS: FarcasterTotalFollowers,
  FARCASTER_LIKE: FarcasterLikeRecast,
  FARCASTER_RECAST: FarcasterLikeRecast,
  FARCASTER_FOLLOW_CHANNEL: FarcasterFollowChannel,
}

const FarcasterRequirement = (props: RequirementProps) => {
  const { type } = useRequirementContext()
  const Component = types[type]
  return <Component {...props} />
}

export default FarcasterRequirement
