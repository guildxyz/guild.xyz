import {
  Avatar,
  Button,
  Collapse,
  HStack,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import platforms from "platforms/platforms"
import { useEffect } from "react"
import { PlatformName } from "types"
import capitalize from "utils/capitalize"

type Props = {
  platformName: string
}

const LinkMoreSocialAccount = ({ platformName }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { onConnect, isLoading, response } = useConnectPlatform(
    platformName as PlatformName,
    onClose
  )
  useEffect(() => onOpen(), [platformName])

  return (
    <Collapse in={isOpen} animateOpacity>
      <HStack spacing={3} alignItems="center" w="full">
        <Avatar
          icon={
            <Icon as={platforms[platformName]?.icon} boxSize={4} color="white" />
          }
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
      </HStack>
    </Collapse>
  )
}

export default LinkMoreSocialAccount
