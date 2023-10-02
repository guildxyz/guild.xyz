import {
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { LockSimple, Wallet } from "phosphor-react"
import platforms from "platforms/platforms"
import { useMemo } from "react"
import { PlatformAccountDetails, PlatformType, Rest } from "types"
import shortenHex from "utils/shortenHex"
import { Member } from "./useMembers"

type Props = {
  member: Member
}

const Identities = ({ member }: Props) => {
  const { addresses, platformUsers } = member

  const sortedAccounts = useMemo(
    () =>
      platformUsers.sort((account1, account2) => {
        if (PlatformType[account2.platformId] === "DISCORD" && account2.username)
          return 1
        if (account2.username && !account1.username) return 1
        return -1
      }),
    [platformUsers]
  )

  const areSocialsPrivate = !platformUsers.length

  return (
    <HStack spacing={1}>
      {sortedAccounts?.map((platformAccount, i) => (
        <IdentityTag
          key={platformAccount.platformId}
          platformAccount={platformAccount}
          order={i}
          zIndex={-1 * i}
          isOpen={i === 0}
        />
      ))}
      <WalletTag>
        {areSocialsPrivate ? shortenHex(addresses?.[0]) : addresses?.length}
      </WalletTag>
      {areSocialsPrivate && <PrivateSocialsTag />}
    </HStack>
  )
}

export const IdentityTag = ({
  platformAccount,
  isOpen,
  ...rest
}: {
  platformAccount: PlatformAccountDetails
  isOpen: boolean
} & Rest) => {
  const platform = platforms[PlatformType[platformAccount.platformId]]
  const username = platformAccount.username ?? platformAccount.platformUserId
  const borderColor = useColorModeValue("white", "var(--chakra-colors-gray-700)")

  return (
    <Tag
      colorScheme={platform.colorScheme as string}
      bg={`${platform.colorScheme}.500`}
      variant="solid"
      px={!isOpen ? "1" : null}
      className="identityTag"
      sx={{ "--stacked-margin-left": "-24px" }}
      transition={"margin .2s"}
      boxShadow={`0 0 0 1px ${borderColor}`}
      {...rest}
    >
      <TagLeftIcon as={platform.icon} /* size=".6em" */ mr="0" />
      {isOpen && <TagLabel ml="1">{username}</TagLabel>}
    </Tag>
  )
}

export const WalletTag = ({ children }) => {
  const borderColor = useColorModeValue("white", "var(--chakra-colors-gray-700)")

  return (
    <Tag
      colorScheme={"gray"}
      bg={`gray.500`}
      variant="solid"
      px="1.5"
      order="0"
      className="identityTag"
      sx={{ "--stacked-margin-left": "-39px" }}
      transition={"margin .2s"}
      boxShadow={`0 0 0 1px ${borderColor}`}
    >
      <TagLeftIcon as={Wallet} mr="0" />
      <TagLabel ml="1">{children}</TagLabel>
    </Tag>
  )
}

export const PrivateSocialsTag = ({ isOpen = false }) => (
  <Tooltip
    label="This user has opted to keep their connected accounts private"
    hasArrow
  >
    <Tag bg="null" borderWidth="1px" px="1.5">
      <TagLeftIcon as={LockSimple} mr="0" />
      {isOpen && <TagLabel ml="1">Private socials</TagLabel>}
    </Tag>
  </Tooltip>
)

export default Identities
