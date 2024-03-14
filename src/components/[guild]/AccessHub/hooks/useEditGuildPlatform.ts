import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { CAPACITY_TIME_PLATFORMS } from "platforms/rewards"
import { GuildPlatform, PlatformName, PlatformType } from "types"
import fetcher from "utils/fetcher"

const useEditGuildPlatform = ({
  guildPlatformId,
  onSuccess,
}: {
  guildPlatformId: number
  onSuccess?: () => void
}) => {
  const { id, mutateGuild } = useGuild()

  const showErrorToast = useShowErrorToast()

  const submit = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms/${guildPlatformId}`, {
      method: "PUT",
      ...signedValidation,
    })

  return useSubmitWithSign<GuildPlatform>(submit, {
    onSuccess: (response) => {
      onSuccess?.()

      mutateGuild(
        (prevGuild) => ({
          ...prevGuild,
          guildPlatforms: prevGuild.guildPlatforms.map((gp) => {
            if (gp.id === guildPlatformId) return response
            return gp
          }),
          roles: CAPACITY_TIME_PLATFORMS.includes(
            PlatformType[response.platformId] as PlatformName
          )
            ? prevGuild.roles.map((role) => {
                if (
                  !role.rolePlatforms?.some(
                    (rp) => rp.guildPlatformId === guildPlatformId
                  )
                )
                  return role

                return {
                  ...role,
                  rolePlatforms: role.rolePlatforms.map((rp) => {
                    if (rp.guildPlatformId !== guildPlatformId) return rp

                    return {
                      ...rp,
                      capacity:
                        response.platformGuildData?.texts?.length ?? rp.capacity,
                    }
                  }),
                }
              })
            : prevGuild.roles,
        }),
        { revalidate: false }
      )
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEditGuildPlatform
