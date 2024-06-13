import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RolePlatform } from "types"
import { useFetcherWithSign } from "utils/fetcher"

type Props = {
  rolePlatform: RolePlatform
  capacity?: number
  startTime?: string
  endTime?: string
}

type MutateProps = {
  id: number
  capacity: number
  startTime?: string
  endTime?: string
}

const useUpdateAvailability = () => {
  const { id: guildId, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

  const submit = async (data: Props) => {
    const { rolePlatform, capacity, startTime, endTime } = data
    const updatedRolePlatform = {
      ...rolePlatform,
      capacity,
      startTime,
      endTime,
    }

    return fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms/${rolePlatform.id}`,
      { method: "PUT", body: updatedRolePlatform },
    ])
  }

  const localMutateGuild = (data: MutateProps) => {
    const { id, capacity, startTime, endTime } = data
    mutateGuild(
      (prevGuild) => ({
        ...prevGuild,
        roles: prevGuild.roles.map((role) => {
          if (role.rolePlatforms.some((rp) => rp.id === id)) {
            return {
              ...role,
              rolePlatforms: findAndUpdateRolePlatform(
                id,
                role.rolePlatforms,
                capacity,
                startTime,
                endTime
              ),
            }
          }
          return role
        }),
      }),
      { revalidate: false }
    )
  }

  return useSubmit<Props, any>(submit, {
    onSuccess: (response) => {
      toast({
        title: "Reward updated!",
        status: "success",
      })
      localMutateGuild(response)
    },
    onError: (error) => showErrorToast(error),
  })
}

const findAndUpdateRolePlatform = (
  idToUpdate: number,
  rolePlatforms: RolePlatform[],
  capacity: number,
  startTime?: string,
  endTime?: string
) =>
  rolePlatforms.map((rp) => {
    if (rp.id === idToUpdate) {
      return {
        ...rp,
        capacity,
        startTime,
        endTime,
      }
    }
    return rp
  })

export default useUpdateAvailability
