import { HStack, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import { Wallet } from "phosphor-react"
import platforms from "platforms/platforms"
import { PlatformAccountDetails, PlatformType, Rest } from "types"
import { Member } from "./CRMTable"

type Props = {
  member: Member
}

const Identities = ({ member }: Props) => {
  const { addresses, platformUsers } = member

  return (
    <HStack spacing={1}>
      {platformUsers?.map((platformAccount, i) => (
        <IdentityTag
          key={platformAccount.platformUserId}
          platformAccount={platformAccount}
          order={i}
          zIndex={-1 * i}
          isOpen={i === 0}
        />
      ))}
      <WalletTag>{addresses?.length}</WalletTag>
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

  return (
    <Tag
      colorScheme={platform.colorScheme as string}
      bg={`${platform.colorScheme}.500`}
      variant="solid"
      px={!isOpen ? "1" : null}
      className="identityTag"
      sx={{ "--stacked-margin-left": "-24px" }}
      transition={"margin .2s"}
      {...rest}
    >
      <TagLeftIcon as={platform.icon} /* size=".6em" */ mr="0" />
      {isOpen && <TagLabel ml="1">{username}</TagLabel>}
    </Tag>
  )
}

export const WalletTag = ({ children }) => (
  <Tag
    colorScheme={"gray"}
    bg={`gray.500`}
    variant="solid"
    px="1.5"
    order="0"
    className="identityTag"
    sx={{ "--stacked-margin-left": "-39px" }}
    transition={"margin .2s"}
  >
    <TagLeftIcon as={Wallet} mr="0" />
    <TagLabel ml="1">{children}</TagLabel>
  </Tag>
)

export default Identities
