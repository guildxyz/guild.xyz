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
  }, [isLoading, hasClicked])

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
  }
}

export default useSubmitWithUpload
