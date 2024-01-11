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
  Stack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"
import { PlatformType, Role } from "types"
import { LoadingModal } from "./LoadingModal"
import MintableRole from "./MintableRole"

const ErrorState = () => (
  <Alert status="error" pb={5} alignItems={"center"} mb={5}>
    <AlertIcon />
    <Stack>
      <AlertDescription position="relative" top={0.5} fontWeight="semibold" pr="4">
        Server not available
      </AlertDescription>
    </Stack>
    <Spacer />
  </Alert>
)

type Props = {
  isOpen: boolean
  onClose: () => void
}

const MintPolygonIDProofModal = ({ isOpen, onClose }: Props) => {
  const { id: userId } = useUser()
  const { id: guildId, roles, guildPlatforms } = useGuild()
  const { isLoading, error } = useSWRImmutable(
    `${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id/claims?format=role&guildId=${guildId}`
  )

  if (isLoading) return <LoadingModal isOpen={isOpen} onClose={onClose} />

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
          {error ? (
            <ErrorState />
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
