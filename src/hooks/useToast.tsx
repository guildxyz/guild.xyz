import {
  ButtonProps,
  LinkProps,
  Text,
  ToastId,
  UseToastOptions,
  useToast as chakraUseToast,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { TwitterLogo } from "phosphor-react"
import { useRef } from "react"

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

type TweetToastOptions = {
  title: string
  tweetText: string
}

const useTweetToast = () => {
  const toast = useActionToast()

  const tweetToast = ({ title, tweetText }: TweetToastOptions) =>
    toast({
      title,
      description: "Let others know as well by sharing it on Twitter",
      buttonProps: {
        leftIcon: <TwitterLogo weight="fill" />,
        children: "Tweet",
        as: "a",
        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          tweetText
        )}`,
        target: "_blank",
      },
    })

  return tweetToast
}

export default useToast
export { useActionToast, useTweetToast }
