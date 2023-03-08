import { Avatar, Button, HStack, Icon, Text } from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { motion } from "framer-motion"
import useToast from "hooks/useToast"
import platforms from "platforms/platforms"
import { PlatformName } from "types"
import capitalize from "utils/capitalize"

type Props = {
  platformName: string
}

const MotionHStack = motion(HStack)

const LinkNewSocialAccount = ({ platformName }: Props): JSX.Element => {
  const toast = useToast()

  const onSuccess = () => {
    toast({
      title: `Account Connected!`,
      status: "success",
    })
  }

  const { onConnect, isLoading, response } = useConnectPlatform(
    platformName as PlatformName,
    onSuccess
  )

  return (
    <MotionHStack layoutId={platformName} spacing={3} alignItems="center" w="full">
      <Avatar
        icon={<Icon as={platforms[platformName]?.icon} boxSize={4} color="white" />}
        boxSize={8}
        bgColor={`${platforms[platformName]?.colorScheme}.500`}
      />
      <Text fontWeight="semibold">{capitalize(platformName.toLowerCase())}</Text>

      <Button
        isLoading={isLoading}
        onClick={onConnect}
        isDisabled={response}
        colorScheme={platforms[platformName].colorScheme}
        size="sm"
        ml="auto !important"
      >
        {"Connect"}
      </Button>
    </MotionHStack>
  )
}

export default LinkNewSocialAccount
