import { Icon, Text, Tooltip, useBreakpointValue, VStack } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useENSName from "components/common/Layout/components/Account/hooks/useENSName"
import { Crown } from "phosphor-react"
import { useMemo } from "react"
import shortenHex from "utils/shortenHex"
import useGuild from "../hooks/useGuild"

type Props = {
  address: string
  isOwner: boolean
}

const dummyServerAdmins = [
  {
    id: 1,
    address: "0x0000000000000000000000000000000000000001",
  },
  {
    id: 3,
    address: "0x0000000000000000000000000000000000000003",
  },
]

const Member = ({ address, isOwner }: Props): JSX.Element => {
  const ENSName = useENSName(address)
  const avatarSize = useBreakpointValue({ base: 6, md: 8 })

  const { admins } = useGuild()

  const isAdmin = useMemo(
    () =>
      dummyServerAdmins //admins
        .map(({ address: adminAddress }) => adminAddress)
        .includes(address),
    [admins, address]
  )

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
      {(isOwner || isAdmin) && (
        <Tooltip label={isOwner ? "Guild creator" : "Guild admin"}>
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
