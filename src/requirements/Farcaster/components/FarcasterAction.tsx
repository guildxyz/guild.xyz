import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import useFarcasterAction from "../hooks/useFarcasterAction"
import { useFarcasterUser } from "../hooks/useFarcasterUsers"

const TYPE_TO_CTA = {
  FARCASTER_FOLLOW: "Follow",
  FARCASTER_LIKE: "Like",
  FARCASTER_RECAST: "Recast",
}

export default function FarcasterAction() {
  const { farcasterProfiles } = useUser()

  const { data, roleId, type } = useRequirementContext<
    | "FARCASTER_FOLLOW"
    | "FARCASTER_FOLLOWED_BY"
    | "FARCASTER_LIKE"
    | "FARCASTER_RECAST"
  >()

  const { data: farcasterUser } = useFarcasterUser(
    type === "FARCASTER_FOLLOW" ? data.id : undefined
  )

  const { onSubmit, isLoading, response } = useFarcasterAction(roleId)

  if (
    (type !== "FARCASTER_FOLLOW" &&
      type !== "FARCASTER_LIKE" &&
      type !== "FARCASTER_RECAST") ||
    !farcasterProfiles?.[0]?.fid ||
    response
  ) {
    return null
  }

  return (
    <RequirementButton
      colorScheme="FARCASTER"
      variant="solid"
      color={undefined}
      isLoading={isLoading}
      onClick={() => {
        if (type === "FARCASTER_LIKE") {
          return onSubmit({
            type: "like",
            castId: data.hash ?? data.url,
          })
        }

        if (type === "FARCASTER_RECAST") {
          return onSubmit({
            type: "recast",
            castId: data.hash ?? data.url,
          })
        }

        if (type === "FARCASTER_FOLLOW") {
          return onSubmit({
            type: "follow",
            targetFid: data.id,
          })
        }
      }}
    >
      {type === "FARCASTER_FOLLOW" && farcasterUser?.display_name
        ? `Follow ${farcasterUser?.display_name}`
        : TYPE_TO_CTA[type]}
    </RequirementButton>
  )
}
