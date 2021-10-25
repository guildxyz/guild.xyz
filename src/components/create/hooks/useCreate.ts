import replacer from "components/common/utils/guildJsonReplacer"
import useJsConfetti from "hooks/useJsConfetti"
import usePersonalSign from "hooks/usePersonalSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { useSWRConfig } from "swr"
import { Guild } from "temporaryData/types"

type ImageResponse = { publicUrl: string }

const uploadImage = (data: FileList): Promise<ImageResponse> => {
  const formData = new FormData()
  formData.append("nftImage", data[0])

  return fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  }).then((response) => response.json())
}

const useCreate = (type: "group" | "guild") => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const { setError } = useFormContext()
  const showErrorToast = useShowErrorToast(setError)
  const triggerConfetti = useJsConfetti()
  const router = useRouter()
  const { addressSignedMessage } = usePersonalSign()
  const [data, setData] = useState<Guild>()

  const fetchData = (data_: Guild): Promise<Guild> =>
    fetch(`${process.env.NEXT_PUBLIC_API}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        { ...data_, addressSignedMessage },
        type === "guild" ? replacer : undefined
      ),
    }).then(async (response) =>
      response.ok ? response.json() : Promise.reject(await response.json?.())
    )

  const { onSubmit, response, error, isLoading } = useSubmit<Guild, Guild>(
    fetchData,
    {
      onError: (error_) => showErrorToast(error_),
      onSuccess: (response_) => {
        triggerConfetti()
        toast({
          title: `${type === "group" ? "Group" : "Guild"} successfully created!`,
          description: "You're being redirected to it's page",
          status: "success",
        })
        // refetch groups to include the new one on the home page
        mutate(type === "group" ? "groups" : "guilds")
        router.push(`${type === "group" ? "/" : "/guild/"}${response_.urlName}`)
      },
    }
  )

  const {
    onSubmit: onSubmitImage,
    response: imageResponse,
    error: imageError,
    isLoading: isImageLoading,
  } = useSubmit<FileList, ImageResponse>(uploadImage, {
    onError: (e) =>
      toast({
        title: "Error uploading image",
        description: e.toString(),
        status: "error",
      }),
  })

  useEffect(() => {
    if (imageResponse?.publicUrl)
      onSubmit({
        ...data,
        imageUrl: imageResponse.publicUrl,
      })
  }, [imageResponse])

  return {
    onSubmit: (_data) => {
      console.log(_data)
      if (_data.customImage) {
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
