import useToast from "hooks/useToast"

type ApiError = {
  errors: Array<{
    msg: string
    value?: string
    param?: string
    location?: string
  }>
}

const useShowErrorToast = () => {
  const toast = useToast()

  const errorToast = (message?: string) =>
    toast({
      title: "Error",
      description: message,
      status: "error",
    })

  const showErrorToast = (error: string | Error | ApiError) => {
    if (!error) return errorToast()

    if (typeof error === "string") return errorToast(error)

    if (error instanceof Error) return errorToast(error.message)

    error.errors?.forEach((err) => {
      if (err.param) {
        // setError?.(
        //   err.param,
        //   { type: "manual", message: err.msg },
        //   { shouldFocus: true }
        // )
        errorToast(`${err.msg} : ${err.param}`)
      } else errorToast(err.msg)
    })
  }

  return showErrorToast
}

export default useShowErrorToast
