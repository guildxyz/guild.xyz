import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { GuildPlatform, PlatformType } from "types"
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

  const submit = async (signedValidation: SignedValdation) =>
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
          roles:
            response.platformId === PlatformType.UNIQUE_TEXT
              ? prevGuild.roles.map((role) => {
                  if (
                    role.rolePlatforms?.some(
                      (rp) => rp.guildPlatformId === guildPlatformId
                    )
                  )
                    return {
                      ...role,
                      rolePlatforms: role.rolePlatforms.map((_rp) => {
                        if (_rp.guildPlatformId === guildPlatformId)
                          return {
                            ..._rp,
                            capacity: response.platformGuildData?.texts?.length ?? 0,
                          }

                        return _rp
                      }),
                    }

                  return role
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
