import fetcher from "utils/fetcher"
import { useSubmitWithSign } from "./useSubmit"
import useToast from "./useToast"

type ImageResponse = { publicUrl: string }

const uploadImage = (data: FileList): Promise<ImageResponse> => {
  const formData = new FormData()
  formData.append("nftImage", data[0])

  return fetcher("/api/upload-image", {
    method: "POST",
    body: formData,
  })
}

const useUploadImage = () => {
  const toast = useToast()

  return useSubmitWithSign<FileList, ImageResponse>(uploadImage, {
    onError: (e) =>
      toast({
        title: "Error uploading image",
        description: e?.error,
        status: "error",
      }),
  })
}

export default useUploadImage
