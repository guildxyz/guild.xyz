import {
  ButtonGroup,
  ButtonProps,
  LinkProps,
  Text,
  ToastId,
  UseToastOptions,
  useToast as chakraUseToast,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { useRef } from "react"

const useToast = (toastOptions?: UseToastOptions) =>
  chakraUseToast({
    position: "top-right",
    variant: "toastSubtle",
    isClosable: true,
    duration: 4000,
    ...toastOptions,
  })

export type ActionToastOptions = UseToastOptions & {
  buttonProps: ButtonProps & LinkProps
  secondButtonProps?: ButtonProps & LinkProps
}

const useToastWithButton = () => {
  const toast = useToast()
  const toastIdRef = useRef<ToastId>()
  const actionButtonBackground = useColorModeValue("blackAlpha.100", undefined)

  return ({
    description,
    buttonProps,
    secondButtonProps,
    ...rest
  }: ActionToastOptions) => {
    const { onClick, ...restButtonProps } = buttonProps
    const { onClick: secondButtonOnClick, ...restSecondButtonProps } =
      secondButtonProps ?? {}

    toastIdRef.current = toast({
      duration: 8000,
      description: (
        <>
          {description && <Text>{description}</Text>}
          <ButtonGroup mt={3} mb="1" size="sm">
            <Button
              bg={actionButtonBackground}
              onClick={() => {
                onClick?.(null)
                toast.close(toastIdRef.current)
              }}
              borderRadius="lg"
              {...restButtonProps}
            />
            {secondButtonProps && (
              <Button
                bg={actionButtonBackground}
                onClick={() => {
                  secondButtonOnClick?.(null)
                  toast.close(toastIdRef.current)
                }}
                borderRadius="lg"
                {...restSecondButtonProps}
              />
            )}
          </ButtonGroup>
        </>
      ),
      ...rest,
    })

    return toastIdRef.current
  }
}

export default useToast
export { useToastWithButton }
