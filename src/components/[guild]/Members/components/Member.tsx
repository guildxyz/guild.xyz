import { Icon, Text, Tooltip, VStack } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useResolveAddress from "hooks/useResolveAddress"
import { Crown } from "phosphor-react"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
  isOwner: boolean
  isAdmin: boolean
}

const Member = ({ address, isOwner, isAdmin }: Props): JSX.Element => {
  const domain = useResolveAddress(address)

  if (!address) return null

  return (
    <VStack
      spacing={2}
      pos="relative"
      opacity="0.5"
      transition="opacity .1s"
      _hover={{ opacity: 1 }}
    >
      <GuildAvatar address={address} size={{ base: 6, md: 8 }} />
      <Text
        fontFamily="display"
        fontWeight="semibold"
        fontSize="sm"
        noOfLines={1}
        maxW="full"
        title={domain || address}
      >
        {domain || `${shortenHex(address, 3)}`}
      </Text>
      {(isOwner || isAdmin) && (
        <Tooltip label={isOwner ? "Guild Master" : "Guild Admin"}>
          <Icon
            opacity={isOwner ? 1 : 0.5}
            pos="absolute"
            top="-2"
            right="0"
            m="0 !important"
            color="yellow.400"
            as={Crown}
            weight="fill"
          />
        </Tooltip>
      )}
    </VStack>
  )
}

export default Member
