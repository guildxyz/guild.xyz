import { Anchor } from "@/components/ui/Anchor"
import { Skeleton } from "@/components/ui/Skeleton"
import RequirementConnectButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import { DataBlockWithCopy } from "components/common/DataBlockWithCopy"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import REQUIREMENTS from "requirements"
import { FarcasterAction } from "./components/FarcasterAction"
import { FarcasterCast } from "./components/FarcasterCast"
import { useFarcasterCast } from "./hooks/useFarcasterCast"
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

  const { data: farcasterUser } = useFarcasterUser(data.id)

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
      {!farcasterUser ? (
        <Skeleton className="inline-block h-5 w-40" />
      ) : (
        <Anchor
          href={`https://warpcast.com/${farcasterUser?.username}`}
          target="_blank"
          showExternal
          variant="highlighted"
        >
          {farcasterUser?.display_name ?? farcasterUser?.username ?? "Loading..."}
        </Anchor>
      )}
      <span>{" on Farcaster"}</span>
    </Requirement>
  )
}

const FarcasterTotalFollowers = (props: RequirementProps) => {
  const { data } = useRequirementContext<"FARCASTER_TOTAL_FOLLOWERS">()

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
  const { data, type, roleId, id } = useRequirementContext<
    "FARCASTER_LIKE" | "FARCASTER_RECAST"
  >()

  const {
    data: cast,
    isLoading: isCastLoading,
    error: castError,
  } = useFarcasterCast(data?.url ?? data?.hash)

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
        <span>{" this cast: "}</span>
        {!cast ? (
          <Skeleton className="inline-block h-5 w-40" />
        ) : (
          <FarcasterCast
            size="sm"
            cast={cast}
            loading={isCastLoading}
            error={castError}
          />
        )}
      </>
    </Requirement>
  )
}

const FarcasterFollowChannel = (props: RequirementProps) => {
  const { data } = useRequirementContext<
    "FARCASTER_FOLLOW_CHANNEL" | "FARCASTER_USERNAME" | "FARCASTER_BIO"
  >()
  const { data: farcasterChannel } = useFarcasterChannel(data.id)

  return (
    <Requirement
      footer={<RequirementConnectButton />}
      image={REQUIREMENTS.FARCASTER_FOLLOW_CHANNEL.icon.toString()}
      {...props}
    >
      <span>{"Follow the "}</span>
      {!farcasterChannel ? (
        <Skeleton className="inline-block h-5 w-40" />
      ) : (
        <Anchor
          href={`https://warpcast.com/~/channel/${data.id}`}
          showExternal
          target="_blank"
          variant="highlighted"
        >
          {farcasterChannel?.label ?? data.id}
        </Anchor>
      )}
      <span>{" channel on Farcaster"}</span>
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
      <span>{"Have "}</span>
      <DataBlockWithCopy text={data?.id} />
      <span>
        {` in your ${REQUIREMENTS.FARCASTER_BIO.name} ${PROFILE_TARGETS[type]}`}
      </span>
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
