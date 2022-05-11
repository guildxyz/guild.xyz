import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { UseFormSetValue } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import pinFileToIPFS, {
  PinataPinFileResponse,
  PinToIPFSProps,
} from "./utils/pinataUpload"

type Props = Partial<{
  setValue: UseFormSetValue<any>
  fieldToSet: string
  onSuccess: (data: PinataPinFileResponse) => void
  onError: (error: any) => void
}>

const usePinata = (
  { fieldToSet, onError, onSuccess, setValue }: Props = {
    fieldToSet: "imageUrl",
  }
) => {
  const toast = useToast()

  const { isLoading: isPinning, onSubmit: onUpload } = useSubmit(
    (ipfsProps: PinToIPFSProps) => pinFileToIPFS(ipfsProps),
    {
      onSuccess: (result) => {
        if (fieldToSet && setValue) {
          setValue(
            fieldToSet,
            `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${result.IpfsHash}`,
            { shouldTouch: true }
          )
        }

        onSuccess?.(result)
      },
      onError: (error) => {
        toast({
          status: "error",
          title: "Failed to upload image",
          description: error,
        })

        if (fieldToSet && setValue) {
          setValue(fieldToSet, `/guildLogos/${getRandomInt(286)}.svg`, {
            shouldTouch: true,
          })
        }

        onError?.(error)
      },
    }
  )

  return { isPinning, onUpload }
}

export default usePinata
