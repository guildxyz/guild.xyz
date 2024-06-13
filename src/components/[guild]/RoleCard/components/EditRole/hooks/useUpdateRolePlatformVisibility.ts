import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RolePlatform, Visibility } from "types"
import { useFetcherWithSign } from "utils/fetcher"

type Props = {
  rolePlatform: RolePlatform
  visibility: Visibility
  visibilityRoleId: number
}

type MutateProps = { id: number; visibility: Visibility; visibilityRoleId: number }

const useUpdateRolePlatformVisibility = () => {
  const { id: guildId, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()
  const toast = useToast()

  const submit = async (data: Props) => {
    const { rolePlatform, visibility, visibilityRoleId } = data
    const updatedRolePlatform = {
      ...rolePlatform,
      visibility,
      visibilityRoleId,
    }

    return fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${rolePlatform.roleId}/role-platforms/${rolePlatform.id}`,
      { method: "PUT", body: updatedRolePlatform },
    ])
  }

  const localMutateGuild = (data: MutateProps) => {
    const { id, visibility, visibilityRoleId } = data
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
                visibility,
                visibilityRoleId
              ),
            }
          }
          return role
        }),
      }),
      { revalidate: false }
    )
  }

  return useSubmit<Props, MutateProps>(submit, {
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
  visibility: Visibility,
  visibilityRoleId: number
) =>
  rolePlatforms.map((rp) => {
    if (rp.id === idToUpdate) {
      return {
        ...rp,
        visibility,
        visibilityRoleId,
      }
    }
    return rp
  })

export default useUpdateRolePlatformVisibility
