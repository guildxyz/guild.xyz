import pinataUpload from "utils/pinataUpload"
import useSubmit from "./useSubmit"
import useToast from "./useToast"

type UploadProps = {
  file: File
  onProgress?: (progress: number) => void
}

export type UseUploadImageData = {
  onSubmit: (data?: UploadProps) => void
  isLoading: boolean
  response?: string
  error?: string
}

const uploadImage = async ({ file, onProgress }) => {
  const pinataRespose = await pinataUpload(file, onProgress)
  return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${pinataRespose.IpfsHash}`
}

const useUploadImage = (): UseUploadImageData => {
  const toast = useToast()

  return useSubmit<UploadProps, string>(uploadImage, {
    onError: (e) =>
      toast({
        title: "Error uploading image",
        description: e?.error,
        status: "error",
      }),
  })
}

export default useUploadImage
