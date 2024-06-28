import { Text } from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useFetcherWithSign } from "utils/fetcher"

type Action =
  | {
      type: "follow"
      targetFid: number
    }
  | {
      type: "like" | "recast"
      castId: string
    }

export default function useFarcasterAction(roleId: number) {
  const { farcasterProfiles, id } = useUser()
  const fetcherWithSign = useFetcherWithSign()
  const { triggerMembershipUpdate } = useMembershipUpdate()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmit(
    async (action?: Action) => {
      if (!action) {
        throw new Error("Unknown Farcaster action")
      }
      if (!farcasterProfiles?.[0]?.fid) {
        throw new Error("First connect your Farcaster account")
      }

      const actionType = action.type
      const actionValue = action.type === "follow" ? action.targetFid : action.castId

      await fetcherWithSign([
        `/v2/users/${id}/farcaster-profiles/${
          farcasterProfiles[0].fid
        }/${actionType}/${encodeURIComponent(actionValue)}`,
        { method: "POST" },
      ])

      triggerMembershipUpdate({ roleIds: [roleId] })

      return action
    },
    {
      onSuccess: (action) => {
        toast({
          status: "success",
          description: (
            <>
              <Text>Farcaster {action.type} successful</Text>
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
