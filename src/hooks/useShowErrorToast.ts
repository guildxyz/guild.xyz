import useToast from "hooks/useToast"

const useShowErrorToast = () => {
  const toast = useToast()

  const errorToast = (message?: string) =>
    toast({
      title: "Error",
      description: message,
      status: "error",
    })

  const showErrorToast = (error: string | Error) => {
    if (!error) return errorToast()

    if (typeof error === "string") return errorToast(error)

    if (error.message) return errorToast(error.message)
  }

  return showErrorToast
}

export default useShowErrorToast
