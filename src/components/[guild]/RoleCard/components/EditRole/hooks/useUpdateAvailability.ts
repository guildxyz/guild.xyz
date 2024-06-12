import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useFetcherWithSign } from "utils/fetcher"

const useUpdateAvailability = () => {
  const { id: guildId, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

  const onSubmit = async (rolePlatform, capacity, startTime, endTime) => {
    const updatedRolePlatform = {
      ...rolePlatform,
      capacity,
      startTime,
      endTime,
    }

    await fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms/${rolePlatform.id}`,
      { method: "PUT", body: updatedRolePlatform },
    ])
      .then(async () => {
        await mutateGuild()
      })
      .catch((error) => showErrorToast(error))
  }

  return onSubmit
}

export default useUpdateAvailability
