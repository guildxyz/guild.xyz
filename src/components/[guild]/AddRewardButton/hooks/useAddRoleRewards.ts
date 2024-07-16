import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"

const useAddRoleRewards = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (err: unknown) => void
}) => {
  const { id, urlName, memberCount, mutateGuild } = useGuild()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = { guild: urlName, memberCount }

  const showErrorToast = useShowErrorToast()
  const toast = useToast()
  const fetcherWithSign = useFetcherWithSign()

  const fetchData = async (body) =>
    Promise.all(
      body?.roleIds.map((roleId) =>
        fetcherWithSign([
          `/v2/guilds/${id}/roles/${roleId}/role-platforms`,
          { body, method: "POST" },
        ])
      )
    )

  return useSubmit(fetchData, {
    onError: (error) => {
      showErrorToast(error)
      captureEvent("useAddRoleReward error", { ...postHogOptions, error })
      onError?.(error)
    },
    onSuccess: () => {
      toast({ status: "success", title: "Reward successfully added" })
      mutateGuild()
      onSuccess?.()
    },
  })
}

export default useAddRoleRewards
