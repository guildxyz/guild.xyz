import {
  Alert,
  AlertDescription,
  AlertIcon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { PlatformType, Role } from "types"
import useClaimedRoles from "../hooks/useClaimedRoles"
import MintableRole, { MintableRoleSkeleton } from "./MintableRole"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const MintPolygonIDProofModal = ({ isOpen, onClose }: Props) => {
  const { roles, guildPlatforms } = useGuild()
  const { isLoading, error } = useClaimedRoles()

  const guildPlatformId = guildPlatforms.find(
    (platform) => platform.platformId === PlatformType.POLYGON_ID
  )

  const onlyWithPolygonIDReward = (role: Role) =>
    !!role.rolePlatforms.find(
      (rolePlatform) => rolePlatform.guildPlatformId === guildPlatformId.id
    )

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"} colorScheme={"dark"}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader pb={0}>Mint PolygonID proofs</ModalHeader>
        <ModalBody pt={8}>
          {isLoading ? (
            [...Array(3)].map((_, i) => <MintableRoleSkeleton key={i} />)
          ) : error ? (
            <Alert status="error" pb={5} alignItems="center" mb={5}>
              <AlertIcon />
              <AlertDescription
                position="relative"
                top={0.5}
                fontWeight="semibold"
                pr="4"
              >
                PolygonID issuer error
              </AlertDescription>
              <Spacer />
            </Alert>
          ) : (
            roles
              .filter(onlyWithPolygonIDReward)
              .map((role) => <MintableRole key={role.id} role={role} />)
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MintPolygonIDProofModal
