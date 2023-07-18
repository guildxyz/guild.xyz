import {
  Circle,
  Divider,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Wrap,
  useColorModeValue,
} from "@chakra-ui/react"
import { Row } from "@tanstack/react-table"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import { Member } from "./CRMTable"
import { IdentityTag, WalletTag } from "./Identities"
import { RoleTag } from "./RoleTags"

type Props = {
  row: Row<Member>
}

const MemberModal = ({ row }: Props) => {
  const { addresses, platformUsers, roleIds, joinedAt } = row.original

  const primaryAddress = addresses?.[0]
  const avatarBg = useColorModeValue("gray.100", "blackAlpha.200")
  const domain = useResolveAddress(primaryAddress)

  return (
    <Modal isOpen={row.getIsExpanded()} onClose={row.getToggleExpandedHandler()}>
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
            {platformUsers.map((platformAccount) => (
              <IdentityTag
                key={platformAccount.platformId}
                platformAccount={platformAccount}
                isOpen={true}
                fontWeight="semibold"
              />
            ))}
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
            {roleIds.map((roleId) => (
              <RoleTag key={roleId} roleId={roleId} />
            ))}
          </Wrap>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MemberModal
