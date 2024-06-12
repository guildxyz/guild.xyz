import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { Visibility } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useUpdateRolePlatformVisibility = () => {
  const { id: guildId, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

  const onSubmit = async (
    rolePlatform,
    visibility: Visibility,
    visibilityRoleId: number
  ) => {
    const updatedRolePlatform = {
      ...rolePlatform,
      visibility,
      visibilityRoleId,
    }

    await fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms/${rolePlatform.id}`,
      { method: "PUT", body: updatedRolePlatform },
    ])
      .then(async (res) => {
        await mutateGuild()
      })
      .catch((error) => showErrorToast(error))
  }

  return onSubmit
}

export default useUpdateRolePlatformVisibility
