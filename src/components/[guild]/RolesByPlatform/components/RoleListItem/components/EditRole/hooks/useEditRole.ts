import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import { Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"
import { GatedChannels } from "../components/ChannelsToGate/components/Category"

const useEditRole = (roleId: number, onSuccess?: () => void) => {
  const guild = useGuild()
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
      mutate([`/guild/${guild?.urlName}`, undefined])
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) => {
      data.gatedChannels = Object.entries(
        data.gatedChannels as GatedChannels
      ).reduce(
        (acc, [categoryId, { channels }]) => {
          const channelEntries = Object.entries(channels)
          const filtered = channelEntries.filter(([, { isChecked }]) => isChecked)

          if (filtered.length === channelEntries.length) {
            acc.categories.push(categoryId)
            return acc
          }

          acc.channels = [...acc.channels, ...filtered.map(([id]) => id)]

          return acc
        },
        { categories: [], channels: [] }
      )

      return useSubmitResponse.onSubmit(
        JSON.parse(
          JSON.stringify(
            {
              ...data,
              requirements: preprocessRequirements(data?.requirements),
            },
            replacer
          )
        )
      )
    },
  }
}

export default useEditRole
