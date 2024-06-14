import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RolePlatform } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useAddRewardWithExistingGP = () => {
  const { id, mutateGuild } = useGuild()
  const fetcherWithSign = useFetcherWithSign()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (rolePlatform: RolePlatform) =>
    fetcherWithSign([
      `/v2/guilds/${id}/roles/${rolePlatform.roleId}/role-platforms`,
      { method: "POST", body: rolePlatform },
    ])

  return useSubmit<RolePlatform, any>(submit, {
    onSuccess: (response) => {
      toast({
        title: "Reward updated!",
        status: "success",
      })

      mutateGuild((prevGuild) => ({
        ...prevGuild,
        roles: prevGuild.roles.map((role) => {
          if (role.id === response.platformRoleId) {
            return {
              ...role,
              rolePlatforms: [...role.rolePlatforms, response],
            }
          }
          return role
        }),
      }))
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useAddRewardWithExistingGP
