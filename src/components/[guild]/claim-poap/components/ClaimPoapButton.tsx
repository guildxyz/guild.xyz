import {
  Box,
  ButtonProps,
  Center,
  HStack,
  Icon,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import { Modal } from "components/common/Modal"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { useClaimedReward } from "hooks/useClaimedReward"
import { ArrowSquareOut, CheckCircle } from "phosphor-react"
import useClaimText from "platforms/SecretText/hooks/useClaimText"
import { useAccount } from "wagmi"

type Props = {
  rolePlatformId: number
} & ButtonProps

const ClaimPoapButton = ({ rolePlatformId, ...rest }: Props) => {
  const { captureEvent } = usePostHogContext()

  const { urlName, roles } = useGuild()
  const { address } = useAccount()

  const roleId = roles?.find((role) =>
    role.rolePlatforms.some((rp) => rp.id === rolePlatformId)
  )?.id
  const { isLoading: isAccessLoading, hasRoleAccess } = useRoleMembership(roleId)

  const { claimed } = useClaimedReward(rolePlatformId)

  const {
    onSubmit,
    isPreparing,
    isLoading: isClaimLoading,
    error,
    response,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimText(rolePlatformId)

  const isLoading = isAccessLoading || isPreparing || isClaimLoading

  const httpsLink = response?.uniqueValue?.replace("http://", "https://")

  return (
    <>
      <Button
        size="lg"
        w="full"
        isLoading={isLoading}
        loadingText={
          isAccessLoading || isPreparing ? "Checking access" : "Claiming POAP"
        }
        onClick={() => {
          captureEvent("Click: ClaimPoapButton", {
            guild: urlName,
          })
          onOpen()
          if (!response) onSubmit()
        }}
        {...rest}
        isDisabled={rest?.isDisabled}
      >
        {claimed
          ? "View mint link"
          : !hasRoleAccess
          ? "Check access & claim"
          : "Claim now"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />

          <ModalHeader pb={0}>
            {claimed ? "Your mint link" : "Claim POAP"}
          </ModalHeader>

          <ModalBody pt={8}>
            {isLoading ? (
              <HStack spacing="6">
                <Center boxSize="16">
                  <Spinner />
                </Center>
                <Text>Getting your mint link...</Text>
              </HStack>
            ) : httpsLink ? (
              <HStack spacing={0}>
                <Icon
                  as={CheckCircle}
                  color="green.500"
                  boxSize="16"
                  weight="light"
                />
                <Box pl="6" w="calc(100% - var(--chakra-sizes-16))">
                  <Text>You can mint your POAP on the link below:</Text>
                  <Link
                    mt={2}
                    maxW="full"
                    href={`${httpsLink}?address=${address}`}
                    colorScheme="blue"
                    isExternal
                    fontWeight="semibold"
                  >
                    <Text as="span" noOfLines={1}>
                      {httpsLink}
                    </Text>
                    <Icon as={ArrowSquareOut} />
                  </Link>
                </Box>
              </HStack>
            ) : (
              <ErrorAlert label={error?.error ?? "Something went wrong"} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default ClaimPoapButton
