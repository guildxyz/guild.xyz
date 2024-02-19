import {
  Circle,
  Divider,
  HStack,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  useColorModeValue,
  Wrap,
} from "@chakra-ui/react"
import { Row } from "@tanstack/react-table"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import useResolveAddress from "hooks/useResolveAddress"
import { PlatformAccountDetails, PlatformType } from "types"
import {
  deduplicateXPlatformUsers,
  IdentityTag,
  PrivateSocialsTag,
  WalletTag,
} from "./Identities"
import { ClickableCrmRoleTag } from "./RoleTags"
import { Member } from "./useMembers"

type Props = {
  row: Row<Member>
  isOpen: boolean
  onClose: () => void
}

const MemberModal = ({ row, isOpen, onClose }: Props) => {
  const { addresses, platformUsers, roles, joinedAt, areSocialsPrivate } =
    row.original

  const filteredPlatformUsers = deduplicateXPlatformUsers(platformUsers)

  const rolesColumn = row
    .getAllCells()
    .find((cell) => cell.column.id === "publicRoles").column.parent

  const primaryAddress = addresses?.[0]
  const avatarBg = useColorModeValue("gray.100", "blackAlpha.200")
  const domain = useResolveAddress(primaryAddress)

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton top={9} right={8} />

        <ModalHeader pb="6">
          <HStack spacing={2.5}>
            <Circle size={12} bg={avatarBg}>
              <GuildAvatar
                address={primaryAddress}
                size={5}
                display="flex"
                alignItems="center"
              />
            </Circle>
            <CopyableAddress
              address={primaryAddress}
              domain={domain}
              decimals={5}
              fontWeight="bold"
              fontSize="lg"
            />
          </HStack>
        </ModalHeader>

        <ModalBody>
          <Wrap>
            {areSocialsPrivate ? (
              <PrivateSocialsTag isOpen />
            ) : platformUsers.length ? (
              filteredPlatformUsers.map((platformAccount) => {
                const platformUrl = getPlatformUrl(platformAccount)

                return (
                  <LinkWrappedTag url={platformUrl} key={platformAccount.platformId}>
                    <IdentityTag
                      platformAccount={platformAccount}
                      fontWeight="semibold"
                      isOpen
                    />
                  </LinkWrappedTag>
                )
              })
            ) : (
              <Tag>No connected socials</Tag>
            )}
            {addresses.slice(1).map((address) => (
              <WalletTag key={address}>
                <CopyableAddress address={address} fontSize="sm" />
              </WalletTag>
            ))}
          </Wrap>

          <Text fontWeight={"bold"} mt="8" mb="2">
            Member since
          </Text>
          <Text>{new Date(joinedAt).toLocaleDateString()}</Text>

          <Divider my="6" />

          <Text fontWeight={"bold"} mt="6" mb="3">
            Roles
          </Text>
          <Wrap>
            {Object.values(roles)
              .flat()
              .map(({ roleId, amount }) => (
                <ClickableCrmRoleTag
                  key={roleId}
                  roleId={roleId}
                  amount={amount}
                  column={rolesColumn}
                  onFilter={onClose}
                />
              ))}
          </Wrap>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const getPlatformUrl = (platformAccount: PlatformAccountDetails) => {
  const { username, platformUserId: userId, platformId } = platformAccount

  const platformUrls: Partial<Record<PlatformType, string | null>> = {
    [PlatformType.TWITTER]: username ? `https://x.com/${username}` : null,
    [PlatformType.TWITTER_V1]: username ? `https://x.com/${username}` : null,
    [PlatformType.GITHUB]: username ? `https://github.com/${username}` : null,
    [PlatformType.TELEGRAM]: username ? `https://t.me/${username}` : null,
    [PlatformType.DISCORD]: userId ? `https://discord.com/users/${userId}` : null,
    [PlatformType.GOOGLE]: username ? `mailto:${username}` : null,
  }

  return platformUrls[platformId]
}

const LinkWrappedTag = ({ url, children }) =>
  !!url ? (
    <Link variant="unstyled" isExternal href={url} _hover={{ opacity: 0.8 }}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  )

export default MemberModal
