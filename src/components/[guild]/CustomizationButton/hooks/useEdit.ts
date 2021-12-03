import replacer from "components/common/utils/guildJsonReplacer"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[role]/hooks/useRole"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useUploadImage from "hooks/useUploadImage"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { Guild, Role } from "temporaryData/types"
import fetcher from "utils/fetcher"

const useEdit = (onClose?: () => void) => {
  const guild = useGuild()
  const role = useRole()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()
  const [data, setData] = useState<any>()

  const submit = (data_: Guild | Role) =>
    fetcher(`/${guild?.id ? "guild" : "role"}/${guild?.id || role?.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        role?.id
          ? {
              ...data_,
              // If react-hook-form returns an "empty" requirement for some reason
              requirements: (data_ as Role).requirements?.filter(
                (requirement) =>
                  requirement.type &&
                  (requirement.address || requirement.key || requirement.value)
              ),
            }
          : data_,
        role?.id ? replacer : undefined
      ),
    })

  const { onSubmit, response, error, isLoading } = useSubmitWithSign<Guild, any>(
    submit,
    {
      onSuccess: () => {
        toast({
          title: `${guild?.id ? "Guild" : "Role"} successfully updated!`,
          status: "success",
        })
        if (onClose) onClose()
        mutate(
          `/${guild?.id ? "guild" : "role"}/urlName/${
            guild?.urlName || role?.urlName
          }`
        )
        router.push(
          `${guild?.id ? "/" : "/role/"}${guild?.urlName || role?.urlName}`
        )
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

export default useEdit
