import Button from "components/common/Button"
import useDropzone from "hooks/useDropzone"
import { PiFile } from "react-icons/pi"

export const INVALID_TOKEN_IDS_ERROR = {
  type: "validate",
  message: "Token IDs must only contain numbers",
}

type Props = {
  onSuccess: (ids: string[]) => void
  onError: (error: typeof INVALID_TOKEN_IDS_ERROR) => void
}

export const validateNftIds = (idsArray: string[]) =>
  idsArray.filter(Boolean).every((num) => /^\d+$/.test(num))

const UploadIDs = ({ onSuccess, onError }: Props) => {
  const parseTxt = (file: PiFile) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const lines = fileReader.result?.toString()?.split("\n")

      if (!validateNftIds(lines)) {
        onError(INVALID_TOKEN_IDS_ERROR)
        return
      }

      onSuccess(lines)
    }

    fileReader.readAsText(file)
  }

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/plain": [".txt"] },
    onDrop: (accepted, fileRejections) => {
      if (fileRejections?.length > 0) {
        onError({
          type: "validate",
          message: fileRejections[0].errors[0].message,
        })
        return
      }

      if (accepted.length > 0) parseTxt(accepted[0])
    },
  })

  return (
    <Button
      {...getRootProps()}
      as="label"
      leftIcon={<PiFile />}
      size="sm"
      borderRadius="lg"
      w="max-content"
    >
      <input {...getInputProps()} hidden />
      {isDragActive ? "Drop the file here" : "Upload .txt"}
    </Button>
  )
}
export default UploadIDs
