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
              rolePlatforms: role.rolePlatforms.map((rp) => {
                if (rp.id === rolePlatformId) {
                  return {
                    ...rp,
                    ...rolePlatformData,
                  }
                }
                return rp
              }),
            }
          }
          return role
        }),
      }),
      { revalidate: false }
    )
  }

  return mutateRolePlatform
}

export default useLocalMutateRolePlatform
