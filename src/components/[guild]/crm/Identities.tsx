import { HStack, Tag, TagLeftIcon, Text } from "@chakra-ui/react"
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
        />
      ))}
      <WalletTag addresses={addresses} />
    </HStack>
  )
}

const IdentityTag = ({
  platformAccount,
  ...rest
}: {
  platformAccount: PlatformAccountDetails
} & Rest) => {
  const platform = platforms[PlatformType[platformAccount.platformId]]
  const isOpen =
    platform.name === "Discord" && platformAccount.platformUserData?.username

  return (
    <Tag
      colorScheme={platform.colorScheme as string}
      bg={`${platform.colorScheme}.500`}
      variant="solid"
      px={!isOpen ? "1" : null}
      {...rest}
    >
      <TagLeftIcon as={platform.icon} /* size=".6em" */ mr="0" />
      {isOpen && <Text ml="1">{platformAccount.platformUserData.username}</Text>}
    </Tag>
  )
}

const WalletTag = ({ addresses }: { addresses: string[] }) => (
  <Tag colorScheme={"gray"} bg={`gray.500`} variant="solid" px="1.5" order="0">
    <TagLeftIcon as={Wallet} mr="0" />
    <Text ml="1">{addresses?.length}</Text>
  </Tag>
)

export default Identities
