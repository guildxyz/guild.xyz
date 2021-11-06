import { Icon, Text, Tooltip, useBreakpointValue, VStack } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useENSName from "components/common/Layout/components/Account/hooks/useENSName"
import { Crown } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import useIsOwner from "../hooks/useIsOwner"

type Props = {
  address: string
}

const Member = ({ address }: Props): JSX.Element => {
  const ENSName = useENSName(address)
  const avatarSize = useBreakpointValue({ base: 6, md: 8 })
  const isOwner = useIsOwner(address)

  if (!address) return null

  return (
    <VStack
      spacing={2}
      pos="relative"
      opacity="0.5"
      transition="opacity .1s"
      _hover={{ opacity: 1 }}
    >
      <GuildAvatar address={address} size={avatarSize} />
      <Text
        fontFamily="display"
        fontWeight="semibold"
        fontSize="sm"
        isTruncated
        maxW="full"
        title={ENSName || address}
      >
        {ENSName || `${shortenHex(address, 3)}`}
      </Text>
      {isOwner && (
        <Tooltip label="Guild creator">
          <Icon
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
