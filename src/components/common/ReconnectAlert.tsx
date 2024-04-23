import { Alert, AlertDescription, AlertIcon, HStack, Text } from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useGateables from "hooks/useGateables"
import rewards from "platforms/rewards"
import { useEffect } from "react"
import { PlatformName, PlatformType } from "types"
import Button from "./Button"

const ReconnectAlert = ({ platformName }: { platformName: PlatformName }) => {
  const { mutate } = useGateables(PlatformType[platformName])
  const { captureEvent } = usePostHogContext()

  useEffect(() => {
    if (platformName !== "DISCORD") {
      return
    }

    captureEvent("[discord setup] reconnect alert is shown")

    return () => {
      captureEvent("[discord setup] reconnect alert is not shown")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    onConnect,
    isLoading: isConnecting,
    loadingText,
  } = useConnectPlatform(platformName, () => mutate(), true)

  return (
    <Alert status="error" mb="6" pb="5">
      <AlertIcon />
      <AlertDescription fontWeight="semibold" w="full">
        <HStack justifyContent={"space-between"} w="full">
          <Text fontSize={{ base: "sm", sm: "md" }}>
            {rewards[platformName].name} connection error, please reconnect
          </Text>
          <Button
            flexShrink={0}
            size="sm"
            colorScheme="white"
            onClick={onConnect}
            isLoading={isConnecting}
            loadingText={loadingText ?? "Loading"}
          >
            Reconnect
          </Button>
        </HStack>
      </AlertDescription>
    </Alert>
  )
}

export default ReconnectAlert
