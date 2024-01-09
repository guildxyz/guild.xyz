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
import { PlatformType, Role } from "types"
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
  const { id: guildId, roles, guildPlatforms } = useGuild()

  const checkDID = useSWR<string>(
    userId
      ? `${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id`
      : null,
    null,
    {
      onErrorRetry: (error) => {
        if (error.status === 500) return
      },
    }
  )
  const claimedRoles = useSWR(
    `${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id/claims?format=role&guildId=${guildId}`
  )

  const [mint, setMint] = useState<Role | null>(null)

  if (checkDID.isLoading || claimedRoles.isLoading) return <LoadingState />

  if (checkDID.error) return <NoDID />

  const onlyWithPolygonIdReward = (role: Role) => {
    const guildPlatformId = guildPlatforms.find(
      (platform) => platform.platformId === PlatformType.POLYGON_ID
    )

    return !!role.rolePlatforms.find(
      (rolePlatform) => rolePlatform.guildPlatformId === guildPlatformId.id
    )
  }

  const isClaimed = (role: Role) =>
    claimedRoles.data.length &&
    !!claimedRoles.data[0].roleIds.find((claimedRoleId) => claimedRoleId === role.id)

  return mint ? (
    <PolygonIdQRCode
      role={mint}
      isClaimed={isClaimed(mint)}
      goBack={() => setMint(null)}
    />
  ) : (
    <>
      <ModalHeader pb={0}>Mint PolygonID proofs</ModalHeader>
      <ModalBody pt={8}>
        {claimedRoles.error && <ErrorState />}
        {roles.filter(onlyWithPolygonIdReward).map((role) => (
          <MintableRole
            key={role.id}
            role={role}
            onMint={setMint}
            isClaimed={isClaimed(role)}
            isLoading={claimedRoles.isLoading}
            isDisabled={!!claimedRoles.error}
          />
        ))}
      </ModalBody>
    </>
  )
}

export default MintPolygonIdProofModalContent
