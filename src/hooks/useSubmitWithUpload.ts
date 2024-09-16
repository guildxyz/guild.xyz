import { useCallback, useEffect, useState } from "react"

const useSubmitWithUpload = (
  handleSubmit: (event?: any) => void,
  isLoading: boolean
) => {
  const [hasClicked, setHasClicked] = useState<boolean>(false)

  useEffect(() => {
    if (hasClicked && !isLoading) {
      setHasClicked(false)
      handleSubmit?.()
    }
  }, [hasClicked, isLoading, setHasClicked, handleSubmit])

  const wrappedHandleSubmit = useCallback(
    (event) => {
      if (isLoading) {
        setHasClicked(true)
      } else {
        handleSubmit(event)
      }
    },
    [isLoading, handleSubmit]
  )

  return {
    handleSubmit: wrappedHandleSubmit,
    isUploadingShown: hasClicked && isLoading,
    uploadLoadingText: hasClicked && isLoading ? "Uploading image" : undefined,
  }
}

export default useSubmitWithUpload
