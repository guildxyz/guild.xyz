import { useCallback, useEffect, useState } from "react"

const useSubmitAfterUpload = (
  handleSubmit: (event?: any) => void,
  isLoading: boolean
) => {
  const [saveClicked, setSaveClicked] = useState<boolean>(false)

  useEffect(() => {
    if (saveClicked && !isLoading) {
      setSaveClicked(false)
      handleSubmit?.()
    }
  }, [isLoading, saveClicked])

  const wrappedHandleSubmit = useCallback(
    (event) => {
      if (isLoading) {
        setSaveClicked(true)
      } else {
        handleSubmit(event)
      }
    },
    [isLoading, handleSubmit]
  )

  return { handleSubmit: wrappedHandleSubmit, isUploading: saveClicked && isLoading }
}

export default useSubmitAfterUpload
