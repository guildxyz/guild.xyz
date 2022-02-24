import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidationData } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useState } from "react"
import { useSWRConfig } from "swr"
import { Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

const useEditRole = (roleId: number) => {
  const guild = useGuild()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const [data, setData] = useState<any>()

  const submit = ({ validationData, ...data_ }: WithValidationData<Role>) =>
    fetcher(`/role/${roleId}`, {
      method: "PATCH",
      body: {
        ...data_,
        // Mapping requirements in order to properly send "interval-like" NFT attribute values to the API
        requirements: data_?.requirements
          ? preprocessRequirements(data_.requirements)
          : undefined,
      },
      validationData,
      replacer,
    })

  const { onSubmit, response, error, isLoading } = useSubmitWithSign<Role, any>(
    submit,
    {
      onSuccess: () => {
        toast({
          title: `Role successfully updated!`,
          status: "success",
        })
        mutate(`/guild/urlName/${guild?.urlName}`)
      },
      onError: (err) => showErrorToast(err),
    }
  )

  return {
    onSubmit: (_data) => {
      onSubmit({
        ..._data,
        ...(_data.backgroundImage?.length
          ? {
              theme: {
                ..._data.theme,
                backgroundImage: _data.imageUrl,
              },
            }
          : {}),
      })
    },
    error,
    isLoading,
    response,
  }
}

export default useEditRole
