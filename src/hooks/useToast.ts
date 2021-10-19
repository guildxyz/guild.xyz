import { useToast as chakraUseToast, UseToastOptions } from "@chakra-ui/react"

const useToast = (toastOptions?: UseToastOptions) => {
  const useToastWithDefaults = chakraUseToast({
    position: "top-right",
    variant: "toastSubtle",
    isClosable: true,
    duration: 4000,
    ...toastOptions,
  })

  return useToastWithDefaults
}

export default useToast
