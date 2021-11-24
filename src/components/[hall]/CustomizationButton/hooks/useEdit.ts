import replacer from "components/common/utils/guildJsonReplacer"
import useGuild from "components/[guild]/hooks/useGuild"
import useHall from "components/[hall]/hooks/useHall"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useUploadImage from "hooks/useUploadImage"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { Hall } from "temporaryData/types"

const useEdit = (onClose?: () => void) => {
  const hall = useHall()
  const guild = useGuild()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const router = useRouter()
  const [data, setData] = useState<any>()

  const submit = (data_: Hall) =>
    fetch(
      `${process.env.NEXT_PUBLIC_API}/${hall?.id ? "group" : "guild"}/${
        hall?.id || guild?.id
      }`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data_, guild.id ? replacer : undefined),
      }
    ).then(async (response) =>
      response.ok ? response.json() : Promise.reject(await response.json?.())
    )

  const { onSubmit, response, error, isLoading } = useSubmitWithSign<Hall, any>(
    submit,
    {
      onSuccess: () => {
        toast({
          title: `${hall?.id ? "Hall" : "Guild"} successfully updated!`,
          status: "success",
        })
        if (onClose) onClose()
        mutate(
          `/${hall?.id ? "group" : "guild"}/urlName/${
            hall?.urlName || guild?.urlName
          }`
        )
        router.push(
          `${hall?.id ? "/" : "/guild/"}${hall?.urlName || guild?.urlName}`
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
