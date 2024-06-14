import useGuild from "components/[guild]/hooks/useGuild"
import { RolePlatform } from "types"

const useLocalMutateRolePlatform = () => {
  const { mutateGuild } = useGuild()

  const mutateRolePlatform = (
    rolePlatformId: number,
    rolePlatformData: Partial<RolePlatform>
  ) => {
    mutateGuild(
      (prevGuild) => ({
        ...prevGuild,
        roles: prevGuild.roles.map((role) => {
          if (role.rolePlatforms.some((rp) => rp.id === rolePlatformId)) {
            return {
              ...role,
              rolePlatforms: findAndUpdateRolePlatform(
                rolePlatformId,
                role.rolePlatforms,
                rolePlatformData
              ),
            }
          }
          return role
        }),
      }),
      { revalidate: false }
    )
  }

  const findAndUpdateRolePlatform = (
    idToUpdate: number,
    rolePlatforms: RolePlatform[],
    rolePlatformData: Partial<RolePlatform>
  ) =>
    rolePlatforms.map((rp) => {
      if (rp.id === idToUpdate) {
        return {
          ...rp,
          ...rolePlatformData,
        }
      }
      return rp
    })

  return mutateRolePlatform
}

export default useLocalMutateRolePlatform
