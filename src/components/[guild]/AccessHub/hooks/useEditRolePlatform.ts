import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { RolePlatform } from "types"
import fetcher from "utils/fetcher"

const useEditRolePlatform = ({
  rolePlatformId,
  onSuccess,
}: {
  rolePlatformId: number
  onSuccess?: () => void
}) => {
  const { id, roles, mutateGuild } = useGuild()
  const roleId = roles.find(
    (role) => !!role.rolePlatforms.find((rp) => rp.id === rolePlatformId)
  )?.id

  const showErrorToast = useShowErrorToast()

  const submit = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/roles/${roleId}/role-platforms/${rolePlatformId}`, {
      method: "PUT",
      ...signedValidation,
    })

  return useSubmitWithSign<RolePlatform>(submit, {
    onSuccess: (response) => {
      onSuccess?.()

      mutateGuild(
        (prevGuild) => ({
          ...prevGuild,
          roles: prevGuild.roles.map((role) => {
            if (role.id !== roleId) return role

            return {
              ...role,
              rolePlatforms: role.rolePlatforms.map((rp) => {
                if (rp.id !== rolePlatformId) return { ...rp, roleId: role.id }
                return { ...response, roleId: role.id }
              }),
            }
          }),
        }),
        { revalidate: false }
      )
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEditRolePlatform
