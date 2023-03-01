import {
  Avatar,
  AvatarBadge,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { Link } from "phosphor-react"
import { PlatformName } from "types"

type Props = {
  platformName: string
}

const LinkMoreSocialAccount = ({ platformName }: Props): JSX.Element => {
  const { onConnect, isLoading, loadingText, response } = useConnectPlatform(
    platformName as PlatformName
  )

  return (
    <>
      <HStack spacing={3} alignItems="center" w="full">
        <Avatar
          // src={image}
          size="sm"
        >
          <AvatarBadge
            boxSize={5}
            // bgColor={`${platforms[type]?.colorScheme}.500`}
            borderWidth={1}
            // borderColor={circleBorderColor}
          >
            <Icon
              //  as={platforms[type]?.icon}
              boxSize={3}
              color="white"
            />
          </AvatarBadge>
        </Avatar>
        <Text fontWeight="semibold">{platformName}</Text>
        <Tooltip label="Connect account" placement="top" hasArrow>
          <IconButton
            rounded="full"
            variant="ghost"
            size="sm"
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
