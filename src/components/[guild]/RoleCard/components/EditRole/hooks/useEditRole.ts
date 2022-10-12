import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import { Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessGatedChannels from "utils/preprocessGatedChannels"
import preprocessRequirements from "utils/preprocessRequirements"

const useEditRole = (roleId: number, onSuccess?: () => void) => {
  const { id, mutateGuild, guildPlatforms } = useGuild()
  const { account } = useWeb3React()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = ({ validation, data }: WithValidation<Role>) =>
    fetcher(`/role/${roleId}`, {
      method: "PATCH",
      body: data,
      validation,
    })

  const useSubmitResponse = useSubmitWithSign<Role, any>(submit, {
    onSuccess: () => {
      toast({
        title: `Role successfully updated!`,
        status: "success",
      })
      if (onSuccess) onSuccess()
      mutateGuild()
      mutate(`/guild/access/${id}/${account}`)
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) => {
      const guildifyRole = data?.requirements?.find((req) => !!req?.data?._guildify)

      if (guildifyRole) {
        const existingGuildPlatform = guildPlatforms?.find(
          (guildPlatform) =>
            guildPlatform.platformGuildId === guildifyRole?.data?.serverId
        )

        const rolePlatformToEdit = data.rolePlatforms.find(
          (rolePlatform) =>
            rolePlatform.isNew &&
            (rolePlatform.guildPlatform?.platformGuildId ===
              guildifyRole?.data?.serverId ||
              (!!existingGuildPlatform &&
                rolePlatform.guildPlatformId === existingGuildPlatform.id))
        )

        if (!!rolePlatformToEdit) {
          rolePlatformToEdit.platformRoleId = guildifyRole.data?.roleId ?? null
        }
      }

      data.requirements = preprocessRequirements(data?.requirements)

      data.rolePlatforms = data.rolePlatforms.map((rolePlatform) => {
        if (rolePlatform.platformRoleData?.gatedChannels)
          rolePlatform.platformRoleData.gatedChannels = preprocessGatedChannels(
            rolePlatform.platformRoleData.gatedChannels
          )
        return rolePlatform
      })

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useEditRole
