import useToast from "hooks/useToast"

export type ApiError = {
  msg: string
  value?: string
  param?: string
  location?: string
}

const useShowErrorToast = () => {
  const toast = useToast()

  const showErrorToast = (errors: string | ApiError[]) => {
    if (typeof errors === "string") {
      toast({
        title: "Error",
        description: errors,
        status: "error",
        duration: 4000,
      })
      return
    }

    errors?.forEach((error) =>
      toast({
        title: "Error",
        description: error.msg + (error.param ? `: ${error.param}` : ""),
        status: "error",
        duration: 4000,
      })
    )
  }

  return showErrorToast
}

export default useShowErrorToast
