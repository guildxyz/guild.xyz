import { Text } from "@chakra-ui/react"
import { RequirementButton } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import useFarcasterAction from "../hooks/useFarcasterAction"
import { useFarcasterUser } from "../hooks/useFarcasterUsers"

export default function FarcasterActionFollow() {
  const { farcasterProfiles } = useUser()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { data, roleId } = useRequirementContext<
    "FARCASTER_FOLLOW" | "FARCASTER_FOLLOWED_BY"
  >()

  const { data: farcasterUser } = useFarcasterUser(data.id)

  const { onSubmit, isLoading, response } = useFarcasterAction(roleId, "follow", {
    onSuccess: () => {
      toast({
        status: "success",
        description: (
          <>
            <Text>
              {farcasterUser
                ? `Successfully followed ${farcasterUser.display_name}`
                : "Farcaster follow successful"}
            </Text>
            <Text fontSize={"sm"}>
              It might take some time until it shows up in external clients, such as
              Warpcast
            </Text>
          </>
        ),
      })
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })

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
      Follow {farcasterUser?.display_name ?? "on Farcaster"}
    </RequirementButton>
  )
}
