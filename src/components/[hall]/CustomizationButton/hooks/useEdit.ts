import replacer from "components/common/utils/guildJsonReplacer"
import useGuild from "components/[guild]/hooks/useGuild"
import useHall from "components/[hall]/hooks/useHall"
import usePersonalSign from "hooks/usePersonalSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
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
  const { addressSignedMessage } = usePersonalSign()
  const router = useRouter()
  const [data, setData] = useState<Hall>()

  const submit = (data_: Hall) =>
    fetch(
      `${process.env.NEXT_PUBLIC_API}/${hall ? "group" : "guild"}/${
        hall?.id || guild?.id
      }`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          { addressSignedMessage, ...data_ },
          guild ? replacer : undefined
        ),
      }
    )

  const { onSubmit, response, error, isLoading } = useSubmit<Hall, any>(submit, {
    onSuccess: () => {
      toast({
        title: `${hall ? "Hall" : "Guild"} successfully updated!`,
        status: "success",
      })
      if (onClose) onClose()
      mutate(
        `/${hall ? "group" : "guild"}/urlName/${hall?.urlName || guild?.urlName}`
      )
      router.push(`${hall ? "/" : "/guild/"}${hall?.urlName || guild?.urlName}`)
    },
    onError: (err) => showErrorToast(err),
  })

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
        imageUrl: imageResponse.publicUrl,
      })
  }, [imageResponse])

  return {
    onSubmit: (_data) => {
      if (_data.customImage?.length) {
        setData(_data)
        onSubmitImage(_data.customImage)
      } else onSubmit(_data)
    },
    error: error || imageError,
    isImageLoading,
    isLoading,
    response,
  }
}

export default useEdit
