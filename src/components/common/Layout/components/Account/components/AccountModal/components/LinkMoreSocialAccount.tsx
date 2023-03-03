import {
  Avatar,
  Button,
  Collapse,
  HStack,
  Icon,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { Link } from "phosphor-react"
import platforms from "platforms"
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
          rightIcon={isLoading ? <Spinner size="sm" /> : <Icon as={Link} />}
          onClick={onConnect}
          isDisabled={isLoading || response}
          variant="ghost"
          colorScheme="green"
          size="sm"
          ml="auto !important"
        >
          {!isLoading && "Connect"}
        </Button>
      </HStack>
    </Collapse>
  )
}

export default LinkMoreSocialAccount
