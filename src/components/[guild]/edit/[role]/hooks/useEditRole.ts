import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useUploadImage from "hooks/useUploadImage"
import { useEffect, useState } from "react"
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

  const submit = (data_: Role) =>
    fetcher(`/role/${roleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          ...data_,
          // Mapping requirements in order to properly send "interval-like" NFT attribute values to the API
          requirements: data_?.requirements
            ? preprocessRequirements(data_.requirements)
            : undefined,
        },
        replacer
      ),
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

  const {
    onSubmit: onSubmitImage,
    response: imageResponse,
    error: imageError,
    isLoading: isImageLoading,
  } = useUploadImage()

  useEffect(() => {
    if (imageResponse?.publicUrl)
      onSubmit({
        ...data,
        ...(data.customImage?.length
          ? {
              imageUrl: imageResponse.publicUrl,
            }
          : {
              theme: {
                ...data.theme,
                backgroundImage: imageResponse.publicUrl,
              },
            }),
      })
  }, [imageResponse])

  return {
    onSubmit: (_data) => {
      if (_data.customImage?.length || _data.backgroundImage?.length) {
        setData(_data)
        onSubmitImage(_data.customImage ?? _data.backgroundImage)
      } else onSubmit(_data)
    },
    error: error || imageError,
    isImageLoading,
    isLoading,
    response,
  }
}

export default useEditRole
