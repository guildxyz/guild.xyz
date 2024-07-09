import { Schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import { RolePlatform } from "types"

// TODO: create a Zod schema for this in our types package
export type CreateRolePlatformResponse = RolePlatform & {
  deletedRequirements?: number[]
  createdGuildPlatform: Schemas["GuildReward"]
}

const useCreateRolePlatforms = () => {
  const { id: guildId } = useGuild()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = {
    hook: "useCreateRolePlatforms",
  }

  const createRolePlatforms = async (
    rolePlatforms: Omit<RolePlatform, "id">[]
  ): Promise<CreateRolePlatformResponse[]> => {
    const promises = rolePlatforms.map((rolePlatform) =>
      fetcherWithSign([
        `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms`,
        { method: "POST", body: rolePlatform },
      ])
        .then((res) => ({
          status: "fulfilled",
          result: {
            ...res,
            roleId: rolePlatform.roleId,
          } as CreateRolePlatformResponse,
        }))
        .catch((error) => {
          showErrorToast("Failed to create a reward")
          captureEvent("Failed to create role platform", {
            ...postHogOptions,
            rolePlatform,
            error,
          })
          console.error(error)
          return { status: "rejected", result: error }
        })
    )

    const results = await Promise.all(promises)
    return results
      .filter((res) => res.status === "fulfilled")
      .map((res) => res.result)
  }

  return {
    createRolePlatforms,
  }
}

export default useCreateRolePlatforms
