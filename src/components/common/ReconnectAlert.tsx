import { Alert, AlertDescription, AlertIcon, HStack, Text } from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useGateables from "hooks/useGateables"
import platforms from "platforms"
import { PlatformName } from "types"
import Button from "./Button"

const ReconnectAlert = ({ platformName }: { platformName: PlatformName }) => {
  const { mutate } = useGateables(platformName)

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
            {platforms[platformName].name} connection error, please reconnect
          </Text>
          <Button
            flexShrink={0}
            size="sm"
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
