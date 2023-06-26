import { Text, ToastId, useColorModeValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import { TwitterLogo } from "phosphor-react"
import { useRef } from "react"
import useToast from "./useToast"

const useTweetToast = (): ((title: string, tweetText: string) => void) => {
  const toast = useToast()
  const toastIdRef = useRef<ToastId>()
  const tweetButtonBackground = useColorModeValue("blackAlpha.100", undefined)

  const tweetToast = (title: string, tweetText: string) => {
    toastIdRef.current = toast({
      status: "success",
      title,
      duration: 8000,
      description: (
        <>
          <Text>Let others know as well by sharing it on Twitter</Text>
          <Button
            as="a"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              tweetText
            )}`}
            target="_blank"
            bg={tweetButtonBackground}
            leftIcon={<TwitterLogo weight="fill" />}
            size="sm"
            onClick={() => toast.close(toastIdRef.current)}
            mt={3}
            mb="1"
            borderRadius="lg"
          >
            Share
          </Button>
        </>
      ),
    })
  }

  return tweetToast
}

export default useTweetToast
