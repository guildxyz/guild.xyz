import {
  ButtonProps,
  LinkProps,
  Text,
  ToastId,
  useColorModeValue,
  UseToastOptions,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { useRef } from "react"
import useToast from "./useToast"

type ActionToastOptions = UseToastOptions & {
  buttonProps: ButtonProps & LinkProps
}

const useActionToast = () => {
  const toast = useToast()
  const toastIdRef = useRef<ToastId>()
  const actionButtonBackground = useColorModeValue("blackAlpha.100", undefined)

  const actionToast = ({
    title,
    description,
    buttonProps,
    ...rest
  }: ActionToastOptions) => {
    const { onClick, ...restButtonProps } = buttonProps

    toastIdRef.current = toast({
      status: "success",
      title,
      duration: 8000,
      description: (
        <>
          {description && <Text>{description}</Text>}
          <Button
            bg={actionButtonBackground}
            size="sm"
            onClick={() => {
              onClick?.(null)
              toast.close(toastIdRef.current)
            }}
            mt={3}
            mb="1"
            borderRadius="lg"
            {...restButtonProps}
          />
        </>
      ),
      ...rest,
    })
  }

  return actionToast
}

export default useActionToast
