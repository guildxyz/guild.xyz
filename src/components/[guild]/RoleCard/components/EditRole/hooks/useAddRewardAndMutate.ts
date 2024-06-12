import useAddReward from "components/[guild]/AddRewardButton/hooks/useAddReward"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { AddRewardPanelProps } from "platforms/rewards"
import { useState } from "react"

const useAddRewardAndMutate = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { captureEvent } = usePostHogContext()
  const { mutateGuild } = useGuild()

  const { onSubmit: onAddRewardSubmit, isLoading: isAddRewardLoading } =
    useAddReward({
      onSuccess: async (res) => {
        console.log(res)
        captureEvent("reward successfully added to existing guild")
      },
      onError: (err) => {
        captureEvent("reward failed to add to existing guild", {
          error: err,
        })
      },
    })

  const handleAdd = async (
    roleId,
    data: Parameters<AddRewardPanelProps["onAdd"]>[0]
  ) => {
    setIsLoading(true)
    const { guildPlatform, ...rolePlatform } = data
    const dataToSend = {
      ...guildPlatform,
      rolePlatforms: [
        {
          roleId: roleId,
          platformRoleId: `${roleId}`, // Why a string????
          guildPlatform: guildPlatform,
          ...rolePlatform,
        },
      ],
    }

    onAddRewardSubmit(dataToSend)
      .then(async () => {
        await mutateGuild()
      })
      .finally(() => setIsLoading(false))
  }

  return { handleAdd, isLoading }
}

export default useAddRewardAndMutate
