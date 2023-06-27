import { Text, ToastId, useColorModeValue, UseToastOptions } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useRef } from "react"
import useToast from "./useToast"

type ActionToastOptions = UseToastOptions & {
  actionIcon: JSX.Element
  actionHref?: string
  actionOnClick?: () => void
  actionText: string
}

const useActionToast = (): ((options: ActionToastOptions) => void) => {
  const toast = useToast()
  const toastIdRef = useRef<ToastId>()
  const actionButtonBackground = useColorModeValue("blackAlpha.100", undefined)

  const actionToast = ({
    title,
    actionOnClick,
    actionHref,
    actionIcon,
    actionText,
    description,
    ...rest
  }: ActionToastOptions) => {
    const aProps = actionHref
      ? {
          as: "a",
          href: actionHref,
          target: "_blank",
        }
      : {}

    toastIdRef.current = toast({
      status: "success",
      title,
      duration: 8000,
      description: (
        <>
          {description && <Text>{description}</Text>}
          <Button
            {...aProps}
            bg={actionButtonBackground}
            leftIcon={actionIcon}
            size="sm"
            onClick={() => {
              actionOnClick?.()
              toast.close(toastIdRef.current)
            }}
            mt={3}
            mb="1"
            borderRadius="lg"
          >
            {actionText}
          </Button>
        </>
      ),
      ...rest,
    })
  }

  return actionToast
}

export default useActionToast
