import { useToast as chakraUseToast, UseToastOptions } from "@chakra-ui/react"

const useToast = (toastOptions?: UseToastOptions) => {
  const useToastWithDefaults = chakraUseToast({
    position: "top-right",
    variant: "toastSubtle",
    isClosable: true,
    ...toastOptions,
  })

  return useToastWithDefaults
}

export default useToast
