import useSubmit from "./useSubmit"
import useToast from "./useToast"

type ImageResponse = { publicUrl: string }

const uploadImage = (data: FileList): Promise<ImageResponse> => {
  const formData = new FormData()
  formData.append("nftImage", data[0])

  return fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  }).then((response) =>
    response.ok ? response.json() : Promise.reject(response.json())
  )
}

const useUploadImage = () => {
  const toast = useToast()

  return useSubmit<FileList, ImageResponse>(uploadImage, {
    onError: (e) =>
      toast({
        title: "Error uploading image",
        description: e?.error,
        status: "error",
      }),
  })
}

export default useUploadImage
