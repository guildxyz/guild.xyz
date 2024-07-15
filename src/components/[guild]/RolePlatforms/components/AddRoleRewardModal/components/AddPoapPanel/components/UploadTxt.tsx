import Button from "components/common/Button"
import useDropzone from "hooks/useDropzone"
import { useFormContext } from "react-hook-form"
import { PiFile } from "react-icons/pi"
import { ImportPoapForm } from "../AddPoapPanel"
import { INVALID_LINKS_ERROR, validatePoapLinks } from "./UploadMintLinks"

const UploadTxt = () => {
  const { setValue, setError, clearErrors } = useFormContext<ImportPoapForm>()

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/plain": [".txt"] },
    onDrop: (accepted, fileRejections) => {
      clearErrors("texts")

      if (fileRejections?.length > 0) {
        setError("texts", {
          type: "validate",
          message: fileRejections[0].errors[0].message,
        })
        return
      }

      if (accepted.length > 0) parseTxt(accepted[0])
    },
  })

  const parseTxt = (file: PiFile) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      clearErrors("texts")
      const lines = fileReader.result?.toString()?.split("\n")

      if (!validatePoapLinks(lines)) {
        setError("texts", INVALID_LINKS_ERROR)
        return
      }

      setValue("texts", lines)
    }

    fileReader.readAsText(file)
  }

  return (
    <Button
      {...getRootProps()}
      as="label"
      leftIcon={<PiFile />}
      h={10}
      maxW="max-content"
    >
      <input {...getInputProps()} hidden />
      {isDragActive ? "Drop the file here" : "Upload .txt"}
    </Button>
  )
}
export default UploadTxt
