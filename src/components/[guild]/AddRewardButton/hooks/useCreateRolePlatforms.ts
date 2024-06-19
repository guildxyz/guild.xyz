import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { RolePlatform } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useCreateRolePlatforms = () => {
  const { id: guildId } = useGuild()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

  const createRolePlatforms = async (
    rolePlatforms: RolePlatform[]
  ): Promise<RolePlatform[]> => {
    const promises = rolePlatforms.map((rolePlatform) =>
      fetcherWithSign([
        `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms`,
        { method: "POST", body: rolePlatform },
      ])
        .then((res) => ({
          status: "fulfilled",
          result: { ...res, roleId: rolePlatform.roleId },
        }))
        .catch((error) => {
          showErrorToast("Failed to create a reward")
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
