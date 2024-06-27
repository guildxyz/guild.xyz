import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import useFarcasterAction from "../hooks/useFarcasterAction"
import { useFarcasterUser } from "../hooks/useFarcasterUsers"

export default function FarcasterActionFollow() {
  const { farcasterProfiles } = useUser()

  const { data, roleId } = useRequirementContext<
    "FARCASTER_FOLLOW" | "FARCASTER_FOLLOWED_BY"
  >()

  const { data: farcasterUser } = useFarcasterUser(data.id)

  const { onSubmit, isLoading, response } = useFarcasterAction(roleId, "follow")

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
        onSubmit(data.id.toString())
      }}
    >
      {farcasterUser?.display_name
        ? `Follow ${farcasterUser?.display_name}`
        : "Follow"}
    </RequirementButton>
  )
}
