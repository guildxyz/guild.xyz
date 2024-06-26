import { Text } from "@chakra-ui/react"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import capitalize from "utils/capitalize"
import useFarcasterAction from "../hooks/useFarcasterAction"
import useFarcasterCast from "../hooks/useFarcasterCast"

export default function FarcasterActionReaction({
  reactionType,
}: {
  reactionType: "like" | "recast"
}) {
  const { farcasterProfiles } = useUser()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { data, roleId } = useRequirementContext<
    "FARCASTER_LIKE" | "FARCASTER_RECAST"
  >()

  const { data: cast } = useFarcasterCast(data?.hash ?? data?.url)

  const { onSubmit, isLoading, response } = useFarcasterAction(
    roleId,
    reactionType,
    {
      onSuccess: () => {
        toast({
          status: "success",
          description: (
            <>
              <Text>
                Successfully {reactionType === "like" ? "liked" : "recasted"} the
                cast
                {cast ? ` of ${cast.display_name}` : ""}
              </Text>
              <Text fontSize={"sm"}>
                It might take some time until it shows up in external clients, such
                as Warpcast
              </Text>
            </>
          ),
        })
      },
      onError: (error) => {
        showErrorToast(error)
      },
    }
  )

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
