import { Icon, Link, Skeleton, Text } from "@chakra-ui/react"
import { ArrowSquareOut } from "@phosphor-icons/react/ArrowSquareOut"
import RequirementConnectButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import REQUIREMENTS from "requirements"
import FarcasterAction from "./components/FarcasterAction"
import FarcasterCast from "./components/FarcasterCast"
import useFarcasterCast from "./hooks/useFarcasterCast"
import { useFarcasterChannel } from "./hooks/useFarcasterChannels"
import { useFarcasterUser } from "./hooks/useFarcasterUsers"

const FarcasterProfile = (props: RequirementProps) => (
  <Requirement
    image={REQUIREMENTS.FARCASTER_PROFILE.icon.toString()}
    footer={<RequirementConnectButton />}
    {...props}
  >
    Have a Farcaster profile
  </Requirement>
)

const FarcasterFollowUser = (props: RequirementProps) => {
  const { farcasterProfiles } = useUser()
  const isFarcasterConnected = !!farcasterProfiles?.[0]?.fid

  const { data, type, roleId, id } = useRequirementContext<
    "FARCASTER_FOLLOW" | "FARCASTER_FOLLOWED_BY"
  >()

  const { data: farcasterUser } = useFarcasterUser(
    // TODO: Why is this check needed? Can't we just pass data.id?
    ["FARCASTER_FOLLOW", "FARCASTER_FOLLOWED_BY"].includes(type)
      ? data?.id
      : undefined
  )

  const { reqAccesses } = useRoleMembership(roleId)

  const access = reqAccesses?.find(
    ({ requirementId }) => requirementId === id
  )?.access

  return (
    <Requirement
      footer={
        !isFarcasterConnected ? (
          <RequirementConnectButton />
        ) : access === false ? (
          <FarcasterAction />
        ) : undefined
      }
      image={farcasterUser?.pfp_url || "/requirementLogos/farcaster.png"}
      {...props}
    >
      {type === "FARCASTER_FOLLOW" ? "Follow " : "Be followed by "}
      <Skeleton isLoaded={!!farcasterUser} display={"inline"}>
        <Link
          href={`https://warpcast.com/${farcasterUser?.username}`}
          isExternal
          colorScheme="blue"
          fontWeight="medium"
        >
          {farcasterUser?.display_name ?? "Loading..."}
        </Link>
      </Skeleton>
      {" on Farcaster"}
    </Requirement>
  )
}

const FarcasterTotalFollowers = (props: RequirementProps) => {
  const { data } = useRequirementContext()

  return (
    <Requirement
      footer={<RequirementConnectButton />}
      image={REQUIREMENTS.FARCASTER_TOTAL_FOLLOWERS.icon.toString()}
      {...props}
    >
      {`Have at least ${data?.min ?? "-"} followers on Farcaster`}
    </Requirement>
  )
}

const FarcasterLikeRecast = (props: RequirementProps) => {
  const { farcasterProfiles } = useUser()
  const isFarcasterConnected = !!farcasterProfiles?.[0]?.fid
  const { data, type, roleId, id } = useRequirementContext()

  const {
    data: cast,
    isLoading: isCastLoading,
    error: castError,
  } = useFarcasterCast(data?.hash)

  const { reqAccesses } = useRoleMembership(roleId)

  const access = reqAccesses?.find(
    ({ requirementId }) => requirementId === id
  )?.access

  return (
    <Requirement
      footer={
        !isFarcasterConnected ? (
          <RequirementConnectButton />
        ) : access === false ? (
          <FarcasterAction />
        ) : undefined
      }
      image={REQUIREMENTS.FARCASTER_LIKE.icon.toString()}
      {...props}
    >
      {type === "FARCASTER_LIKE" ? "Like" : "Recast"}
      <>
        {" this cast: "}
        <Skeleton isLoaded={!!cast} display="inline">
          <FarcasterCast
            size="sm"
            cast={cast!}
            loading={isCastLoading}
            error={castError}
          />
        </Skeleton>
      </>
    </Requirement>
  )
}

const FarcasterFollowChannel = (props: RequirementProps) => {
  const { data } = useRequirementContext()
  const { data: farcasterChannel } = useFarcasterChannel(data?.id)

  return (
    <Requirement
      footer={<RequirementConnectButton />}
      image={REQUIREMENTS.FARCASTER_FOLLOW_CHANNEL.icon.toString()}
      {...props}
    >
      {"Follow the "}
      <Skeleton isLoaded={!!farcasterChannel}>
        <Link
          href={`https://warpcast.com/~/channel/${data?.id}`}
          isExternal
          colorScheme="blue"
          fontWeight="medium"
        >
          {farcasterChannel?.label ?? data?.id}
          <Icon as={ArrowSquareOut} mx="1" />
        </Link>
      </Skeleton>
      {" channel on Farcaster"}
    </Requirement>
  )
}

const PROFILE_TARGETS = {
  FARCASTER_USERNAME: "Display Name",
  FARCASTER_BIO: "bio",
}

const FarcasterIncludeText = (props: RequirementProps) => {
  const { type, data } = useRequirementContext<
    "FARCASTER_FOLLOW_CHANNEL" | "FARCASTER_USERNAME" | "FARCASTER_BIO"
  >()

  // This should never happen, but tells TS, that the requirement is expected to be USERNAME / BIO
  if (type === "FARCASTER_FOLLOW_CHANNEL") {
    return null
  }

  return (
    <Requirement
      footer={<RequirementConnectButton />}
      image={REQUIREMENTS.FARCASTER_BIO.icon.toString()}
      {...props}
    >
      <Text as="span">{"Have "}</Text>
      <DataBlockWithCopy text={data?.id} />
      <Text as="span">
        {` in your ${REQUIREMENTS.FARCASTER_BIO.name} ${PROFILE_TARGETS[type]}`}
      </Text>
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
  FARCASTER_USERNAME: FarcasterIncludeText,
  FARCASTER_BIO: FarcasterIncludeText,
} as const

const FarcasterRequirement = (props: RequirementProps) => {
  const { type } = useRequirementContext<keyof typeof types>()
  const Component = types[type]
  return <Component {...props} />
}

export default FarcasterRequirement
