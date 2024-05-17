import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { CAPACITY_TIME_PLATFORMS } from "platforms/rewards"
import { GuildPlatform, PlatformName, PlatformType } from "types"
import { useFetcherWithSign } from "utils/fetcher"

type PartialGuildPlatform = Partial<
  Omit<GuildPlatform, "platformGuildData"> & {
    platformGuildData: Partial<GuildPlatform["platformGuildData"]>
  }
>

const useEditGuildPlatform = ({
  guildPlatformId,
  onSuccess,
}: {
  guildPlatformId: number
  onSuccess?: () => void
}) => {
  const { id, mutateGuild } = useGuild()
  const { guildPlatform: originalGuildPlatform } = useGuildPlatform(guildPlatformId)

  const showErrorToast = useShowErrorToast()

  const fetcherWithSign = useFetcherWithSign()
  const submit = async (data: Partial<GuildPlatform>) =>
    fetcherWithSign([
      `/v2/guilds/${id}/guild-platforms/${guildPlatformId}`,
      {
        method: "PUT",
        /**
         * We need to send the whole platformGuildData here, since our API replaces
         * this object with the data we send inside the request body
         */
        body: {
          platformGuildData: {
            ...originalGuildPlatform.platformGuildData,
            ...data.platformGuildData,
          },
        },
      },
    ])

  return useSubmit<PartialGuildPlatform, GuildPlatform>(submit, {
    onSuccess: (response) => {
      onSuccess?.()

      const isLegacyContractCallReward =
        response.platformGuildData?.function ===
        ContractCallFunction.DEPRECATED_SIMPLE_CLAIM

      mutateGuild(
        (prevGuild) => ({
          ...prevGuild,
          guildPlatforms: prevGuild.guildPlatforms.map((gp) => {
            if (gp.id === guildPlatformId) return response
            return gp
          }),
          roles:
            CAPACITY_TIME_PLATFORMS.includes(
              PlatformType[response.platformId] as PlatformName
            ) || isLegacyContractCallReward
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
