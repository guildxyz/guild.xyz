import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Card,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import GuildLogo from "components/common/GuildLogo"
import { useSubmitWithSign } from "hooks/useSubmit"
import { ArrowLeft, ArrowsClockwise } from "phosphor-react"
import { QRCodeSVG } from "qrcode.react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { mutate } from "swr"
import { Role } from "types"
import fetcher from "utils/fetcher"

const useMintPolygonIdProof = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { roles } = useGuild()

  const isLoading = false

  return {
    isLoading,
    roles: roles.filter((role) => !role.groupId),
    modalProps: {
      isOpen,
      onOpen,
      onClose,
    },
  }
}

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  roles: Role[]
  isLoading?: boolean
  response?: any
  error?: any
}

type Props = {
  role: Role
  isClaimed: boolean
  isLoading: boolean
  isDisabled: boolean
  onMint: (role: Role) => void
}

const MintableRole = ({ role, onMint, isClaimed, isLoading, isDisabled }: Props) => (
  <Card p={4} cursor="grab" mb="3" borderRadius={"2xl"}>
    <HStack spacing={4}>
      <GuildLogo imageUrl={role.imageUrl} size={"36px"} />

      <HStack spacing={1}>
        <Heading
          as="h3"
          fontSize="md"
          fontFamily="display"
          wordBreak="break-all"
          noOfLines={1}
        >
          {role.name}
        </Heading>
      </HStack>

      <Spacer />

      <Button
        colorScheme={isClaimed ? "gray" : "purple"}
        size={"sm"}
        onClick={() => onMint(role)}
        isLoading={isLoading}
        isDisabled={isDisabled}
      >
        {isClaimed ? "show QR" : "Mint proof"}
      </Button>
    </HStack>
  </Card>
)

const NoDID = () => {
  const { id } = useUser()
  const connectPolygonId = useSubmitWithSign(
    () => fetcher("/v1/polygon-id/connect", { method: "POST" }),
    {
      onSuccess: () => {
        mutate(`/v1/users/${id}/polygon-id`)
      },
    }
  )
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({ defaultValues: { did: "" } })

  const DID = useWatch({ name: "did", control })

  return (
    <form
      onSubmit={handleSubmit(({ did }) =>
        connectPolygonId.onSubmit({ did, userId: id })
      )}
    >
      <ModalHeader pb={0}>Connect PolygonID</ModalHeader>
      <ModalBody pt={8}>
        {connectPolygonId.error && (
          <Alert status="error" pb={5} alignItems={"center"} mb={5}>
            <AlertIcon />
            <Stack>
              <AlertDescription
                position="relative"
                top={0.5}
                fontWeight="semibold"
                pr="4"
              >
                Connecting your DID with the Guild has failed.
              </AlertDescription>
            </Stack>
            <Spacer />
          </Alert>
        )}
        <FormControl isRequired isInvalid={!!errors?.did}>
          <FormLabel>Paste your DID</FormLabel>
          <Input
            {...register("did", {
              required: "This field is required",
            })}
          />
          <FormErrorMessage>{errors?.did?.message}</FormErrorMessage>
        </FormControl>
        <Button
          isDisabled={DID === ""}
          colorScheme="green"
          mt={8}
          ml="auto"
          type="submit"
          isLoading={connectPolygonId.isLoading}
          loadingText={"connecting..."}
        >
          Connect
        </Button>
      </ModalBody>
    </form>
  )
}

type PolygonIdQRCodeProps = {
  role: Role
  goBack: () => void
}

const PolygonIdQRCode = ({ role, goBack }: PolygonIdQRCodeProps) => {
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()
  const QR_URL = `/v1/users/${userId}/polygon-id/claim/${guildId}:${role.id}/qrcode`

  /*const claim = useSubmitWithSign(() =>
    fetcher("/v1/polygon-id/claim", {
      method: "POST",
      body: {
        userId: userId,
        guildId: guildId,
        roleId: role.id,
      },
    })
  )
  const qr = useSWR(QR_URL, fetcher)*/

  const qrSize = useBreakpointValue({ base: 300, md: 400 })

  const claim = {
    error: null,
    isLoading: false,
  }

  const qr = {
    error: null,
    isLoading: false,
    data: {
      body: {
        credentials: [
          {
            description:
              "https://raw.githubusercontent.com/guildxyz/polygon-id-schema/main/role.json-ld#GuildCredential",
            id: "b82a9881-87b2-11ee-bcd2-0242ac140005",
          },
        ],
        url: "https://a608-2a02-ab88-7809-ed80-788-b682-fc67-7c1c.ngrok-free.app/v1/agent",
      },
      from: "did:polygonid:polygon:mumbai:2qJ4sqrDWMtKi4DMXNW1v73LifKFv3c3guMo7WXrsP",
      to: "did:polygonid:polygon:mumbai:2qMX52K7uTwrnyzmU4ZgWcvWn5fNNUaGVwwK3Dj4M7",
      id: "58735412-0125-4aba-bf02-ec523241c955",
      thid: "58735412-0125-4aba-bf02-ec523241c955",
      typ: "application/iden3comm-plain-json",
      type: "https://iden3-communication.io/credentials/1.0/offer",
    },
  }

  return (
    <>
      <ModalHeader pb={0}>
        <HStack>
          <IconButton
            rounded="full"
            aria-label="Back"
            size="sm"
            mb="-3px"
            icon={<ArrowLeft size={20} />}
            variant="ghost"
            onClick={goBack}
          />
          <Box>
            <Text>PolygonID proof</Text>
            <Text fontSize={"md"} colorScheme={"gray"} fontFamily={"body"}>
              {role.name}
            </Text>
          </Box>
        </HStack>
      </ModalHeader>
      <ModalBody pt={8}>
        <Center flexDirection={"column"}>
          {claim.error || qr.error ? (
            <ErrorAlert
              label={
                qr.error ? "Couldn't generate QR code" : "Couldn't mint the proof"
              }
            />
          ) : claim.isLoading || qr.isLoading ? (
            <>
              <Spinner size="xl" mt="8" />
              <Text mt="4" mb="8">
                Generating QR code
              </Text>
            </>
          ) : (
            <>
              <Box borderRadius={"md"} borderWidth={3} overflow={"hidden"}>
                <QRCodeSVG value={JSON.stringify(qr.data)} size={qrSize} />
              </Box>
              <Button
                size="xs"
                borderRadius="lg"
                mt="2"
                variant="ghost"
                leftIcon={<ArrowsClockwise />}
                isLoading={qr.isLoading}
                loadingText={"Generating QR code"}
                color="gray"
                onClick={() => mutate(QR_URL)}
              >
                Generate new QR code
              </Button>
              <Text mt="10" textAlign="center">
                Scan with your Polygon ID app! The modal will automatically close on
                successful connect
              </Text>
            </>
          )}
        </Center>
      </ModalBody>
    </>
  )
}

type ModalConetetProp = {
  roles: any
}

const PIDModalContent = ({ roles }: ModalConetetProp) => {
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()
  //const checkDID = useSWR<string>(userId ? `/v1/users/${userId}/polygon-id` : null)
  /*const claimedRoles = useSWR(
    `/v1/users/${userId}/polygon-id/claims?format=role&guildId=${guildId}`,
    fetcher
  )*/

  const [mint, setMint] = useState<Role | null>(null)

  const checkDID = {
    isLoading: false,
    error: null,
    data: "fdsflksd",
  }

  const claimedRoles = {
    isLoading: false,
    error: {},
    data: [
      {
        guildId: 56463,
        roleIds: [92942],
      },
    ],
  }

  if (checkDID.isLoading || claimedRoles.isLoading)
    return (
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

  if (checkDID.error) return <NoDID />

  return mint ? (
    <PolygonIdQRCode role={mint} goBack={() => setMint(null)} />
  ) : (
    <>
      <ModalHeader pb={0}>Mint PolygonID proofs</ModalHeader>
      <ModalBody pt={8}>
        {claimedRoles.error && (
          <Alert status="error" pb={5} alignItems={"center"} mb={5}>
            <AlertIcon />
            <Stack>
              <AlertDescription
                position="relative"
                top={0.5}
                fontWeight="semibold"
                pr="4"
              >
                Server is not available
              </AlertDescription>
            </Stack>
            <Spacer />
          </Alert>
        )}
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

const MintPolygonIdProofModal = ({ isOpen, onClose, roles }: ModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"} colorScheme={"dark"}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <PIDModalContent roles={roles} />
      </ModalContent>
    </Modal>
  )
}

export { MintPolygonIdProofModal }
export default useMintPolygonIdProof
