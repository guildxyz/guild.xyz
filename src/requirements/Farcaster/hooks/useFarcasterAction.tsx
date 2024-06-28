import { Text } from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useFetcherWithSign } from "utils/fetcher"

export default function useFarcasterAction(
  roleId: number,
  action: "follow" | "like" | "recast"
) {
  const { farcasterProfiles, id } = useUser()
  const fetcherWithSign = useFetcherWithSign()
  const { triggerMembershipUpdate } = useMembershipUpdate()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmit(
    async (param?: string) => {
      if (!param) {
        throw new Error("Unknown Farcaster action")
      }
      if (!farcasterProfiles?.[0]?.fid) {
        throw new Error("First connect your Farcaster account")
      }

      await fetcherWithSign([
        `/v2/users/${id}/farcaster-profiles/${
          farcasterProfiles[0].fid
        }/${action}/${encodeURIComponent(param)}`,
        { method: "POST" },
      ])

      triggerMembershipUpdate({ roleIds: [roleId] })

      return true
    },
    {
      onSuccess: () => {
        toast({
          status: "success",
          description: (
            <>
              <Text>Farcaster {action} successful</Text>
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
}
