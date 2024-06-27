import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import capitalize from "utils/capitalize"
import useFarcasterAction from "../hooks/useFarcasterAction"

export default function FarcasterActionReaction({
  reactionType,
}: {
  reactionType: "like" | "recast"
}) {
  const { farcasterProfiles } = useUser()

  const { data, roleId } = useRequirementContext<
    "FARCASTER_LIKE" | "FARCASTER_RECAST"
  >()

  const { onSubmit, isLoading, response } = useFarcasterAction(roleId, reactionType)

  if (!farcasterProfiles || !farcasterProfiles?.[0]?.fid || response) {
    return null
  }

  return (
    <RequirementButton
      colorScheme="FARCASTER"
      variant="solid"
      color={undefined}
      isLoading={isLoading}
      onClick={() => {
        onSubmit(data?.hash ?? data?.url)
      }}
    >
      {capitalize(reactionType)}
    </RequirementButton>
  )
}
