import {
  Alert,
  AlertDescription,
  AlertIcon,
  ModalBody,
  ModalHeader,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useState } from "react"
import useSWR from "swr"
import { Role } from "types"
import MintableRole from "./MintableRole"
import NoDID from "./NoDID"
import PolygonIdQRCode from "./PolygonIdQRCode"

const LoadingState = () => (
  <>
    <ModalHeader pb={0}>
      <Text>Mint PolygonID proofs</Text>
    </ModalHeader>
    <ModalBody pt={8}>
      <Stack gap={3}>
        <Skeleton height={16}></Skeleton>
        <Skeleton height={16}></Skeleton>
      </Stack>
    </ModalBody>
  </>
)

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

const MintPolygonIdProofModalContent = () => {
  const { id: userId } = useUser()
  const { id: guildId, roles } = useGuild()

  const checkDID = useSWR<string>(
    userId
      ? `${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id`
      : null
  )
  const claimedRoles = useSWR(
    `${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id/claims?format=role&guildId=${guildId}`
  )

  const [mint, setMint] = useState<Role | null>(null)

  if (checkDID.isLoading || claimedRoles.isLoading) return <LoadingState />

  if (checkDID.error) return <NoDID />

  return mint ? (
    <PolygonIdQRCode role={mint} goBack={() => setMint(null)} />
  ) : (
    <>
      <ModalHeader pb={0}>Mint PolygonID proofs</ModalHeader>
      <ModalBody pt={8}>
        {claimedRoles.error && <ErrorState />}
        {roles.map((role) => (
          <MintableRole
            key={role.id}
            role={role}
            onMint={setMint}
            isClaimed={
              !!claimedRoles.data[0].roleIds.find(
                (claimedRoleId) => claimedRoleId === role.id
              )
            }
            isLoading={claimedRoles.isLoading}
            isDisabled={!!claimedRoles.error}
          />
        ))}
      </ModalBody>
    </>
  )
}

export default MintPolygonIdProofModalContent
