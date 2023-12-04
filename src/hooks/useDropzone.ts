import {
  DropzoneOptions,
  DropzoneState,
  useDropzone as useReactDropzone,
} from "react-dropzone"

type Props = {
  maxSizeMb?: number
} & DropzoneOptions

export const ERROR_MESSAGES = {
  "file-too-large": "This image is too large, maximum allowed file size is 5MB",
}

const useDropzone = ({
  maxSizeMb = 5,
  ...dropzoneOptions
}: Props = {}): DropzoneState =>
  useReactDropzone({
    ...dropzoneOptions,
    accept: dropzoneOptions.accept ?? { "image/*": [".jpeg", ".png", ".gif"] },
    noClick: dropzoneOptions.noClick ?? true,
    maxSize: dropzoneOptions.maxSize ?? maxSizeMb * 1024 * 1024,
  })

export default useDropzone
