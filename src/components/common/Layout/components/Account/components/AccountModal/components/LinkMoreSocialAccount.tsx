import {
  Avatar,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { Link } from "phosphor-react"
import platforms from "platforms"
import { PlatformName } from "types"
import capitalize from "utils/capitalize"

type Props = {
  platformName: string
}

const LinkMoreSocialAccount = ({ platformName }: Props): JSX.Element => {
  const { onConnect, isLoading, response } = useConnectPlatform(
    platformName as PlatformName
  )

  return (
    <>
      <HStack spacing={3} alignItems="center" w="full">
        <Avatar
          icon={
            <Icon as={platforms[platformName]?.icon} boxSize={4} color="white" />
          }
          boxSize={8}
          bgColor={`${platforms[platformName]?.colorScheme}.500`}
        />
        <Text fontWeight="semibold">{capitalize(platformName.toLowerCase())}</Text>
        <Tooltip label="Connect account" placement="top" hasArrow>
          <IconButton
            rounded="full"
            variant="ghost"
            size="sm"
            isDisabled={isLoading || response}
            icon={isLoading ? <Spinner size="sm" /> : <Icon as={Link} />}
            colorScheme="green"
            ml="auto !important"
            onClick={onConnect}
            aria-label="Connecting account"
          />
        </Tooltip>
      </HStack>
    </>
  )
}

export default LinkMoreSocialAccount
