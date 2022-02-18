import { useEffect, useState } from "react"
import { UseFormHandleSubmit } from "react-hook-form"

const useUploadPromise = <Data>(
  handleSubmit: UseFormHandleSubmit<Data>,
  uploadPromiseProp?: Promise<void>
) => {
  const [uploadPromise, setUploadPromise] =
    useState<Promise<void>>(uploadPromiseProp)

  useEffect(
    () => setUploadPromise(uploadPromiseProp),
    [uploadPromiseProp, setUploadPromise]
  )

  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!!uploadPromise) {
      setIsUploading(true)
      uploadPromise.finally(() => setIsUploading(false))
    }
  }, [uploadPromise, setIsUploading])

  return {
    isUploading,
    shouldBeLoading: isLoading,
    setUploadPromise,
    uploadPromise,
    handleSubmit:
      (onValid: (data) => void, onInValid?: (data) => void) => (event) => {
        // handleSubmit just for validation here, so we don't go in "uploading images" state, and focus invalid fields after the loading
        handleSubmit(() => {
          setIsLoading(true)
          if (isUploading) {
            uploadPromise
              .catch(() => setIsLoading(false))
              .then(() =>
                handleSubmit((data) => {
                  onValid?.(data)
                  setIsLoading(false)
                })(event)
              )
          } else {
            handleSubmit((data) => {
              onValid?.(data)
              setIsLoading(false)
            })(event)
          }
        }, onInValid)(event)
      },
  }
}

export default useUploadPromise
