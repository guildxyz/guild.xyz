import replacer from "components/common/utils/guildJsonReplacer"
import useJsConfetti from "hooks/useJsConfetti"
import usePersonalSign from "hooks/usePersonalSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useUploadImage from "hooks/useUploadImage"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { useSWRConfig } from "swr"
import { Guild } from "temporaryData/types"

const useCreate = (type: "hall" | "guild") => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const { setError } = useFormContext()
  const showErrorToast = useShowErrorToast(setError)
  const triggerConfetti = useJsConfetti()
  const router = useRouter()
  const { addressSignedMessage } = usePersonalSign()
  const [data, setData] = useState<Guild>()

  const fetchData = (data_: Guild): Promise<Guild> =>
    fetch(`${process.env.NEXT_PUBLIC_API}/${type === "hall" ? "group" : "guild"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        { ...data_, addressSignedMessage },
        type === "guild" ? replacer : undefined
      ),
    }).then(async (response) =>
      response.ok ? response.json() : Promise.reject(await response.json?.())
    )

  const { onSubmit, response, error, isLoading } = useSubmitWithSign<Guild, Guild>(
    fetchData,
    {
      onError: (error_) => showErrorToast(error_),
      onSuccess: (response_) => {
        triggerConfetti()
        toast({
          title: `${type === "hall" ? "Hall" : "Guild"} successfully created!`,
          description: "You're being redirected to it's page",
          status: "success",
        })
        // refetch halls to include the new one on the home page
        mutate(type === "hall" ? "/group" : "/guild")
        router.push(`${type === "hall" ? "/" : "/guild/"}${response_.urlName}`)
      },
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

export default useCreate
