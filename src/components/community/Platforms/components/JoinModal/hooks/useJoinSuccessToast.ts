import { usePrevious, useToast } from "@chakra-ui/react"
import platformsContent from "components/community/Platforms/platformsContent"
import { useEffect } from "react"
import useIsMember from "../../PlatformButton/hooks/useIsMember"

const useJoinSuccessToast = (platform: string) => {
  const isMember = useIsMember(platform)
  const prevIsMember = usePrevious(isMember)
  const toast = useToast()

  useEffect(() => {
    // the last condition would be enough just for the changes, we need the first two to handle mount
    if (prevIsMember === undefined || prevIsMember === true || !isMember) return null

    toast({
      title: `Successfully joined ${platformsContent[platform].title}`,
      description:
        platform === "telegram"
          ? "Medousa will send you the links to the actual groups"
          : undefined,
      position: "top-right",
      status: "success",
      variant: "toastSubtle",
      isClosable: true,
    })
  }, [isMember, platform, toast]) // intentionally leaving the ref out
}

export default useJoinSuccessToast
