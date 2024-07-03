import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RolePlatform } from "types"

const useAddRolePlatform = (roleId: number) => {
  const { id, mutateGuild } = useGuild()
  const fetcherWithSign = useFetcherWithSign()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (rolePlatform: RolePlatform) =>
    fetcherWithSign([
      `/v2/guilds/${id}/roles/${roleId}/role-platforms`,
      { method: "POST", body: rolePlatform },
    ])

  return useSubmit<RolePlatform, any>(submit, {
    onSuccess: (response) => {
      toast({
        title: "Reward added!",
        status: "success",
      })

      mutateGuild(
        (prevGuild) => {
          const data = {
            ...prevGuild,
            guildPlatforms: response?.createdGuildPlatform
              ? [...prevGuild.guildPlatforms, response?.createdGuildPlatform]
              : prevGuild.guildPlatforms,
            roles: prevGuild.roles.map((role) => {
              if (role.id === roleId) {
                return {
                  ...role,
                  rolePlatforms: [
                    ...role.rolePlatforms,
                    { ...response, roleId: roleId },
                  ],
                }
              }
              return role
            }),
          }

          return data
        },
        { revalidate: false }
      )
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useAddRolePlatform
