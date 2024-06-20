import {
  Box,
  ButtonProps,
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  Tooltip,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useCountdownSeconds from "hooks/useCountdownSeconds"
import useSubmit, { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { ArrowCounterClockwise } from "phosphor-react"
import rewards from "platforms/rewards"
import { QRCodeSVG } from "qrcode.react"
import { useState } from "react"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import DisconnectAccountButton from "./components/DisconnectAccountButton"
import SocialAccountUI from "./components/SocialAccountUI"

// Polling will only start after this much time
const APPROVAL_POLL_INITIAL_DELAY_MS = 15_000
// Delay between polls
const APPROVAL_POLL_INTERVAL_MS = 5000
// Poll ends, and a new QR is generated this much before the actual deadline
const POLL_EARLY_END_SEC = 120
// Enable the manual QR regenation button, when less than this muc seconds is left
const ENABLE_REGENERATE_BUTTON_AT_SEC = 10 * 60

const FarcasterProfile = () => {
  const { farcasterProfiles } = useUser()
  const isConnected = farcasterProfiles?.length > 0

  return (
    <SocialAccountUI
      type={"FARCASTER"}
      username={farcasterProfiles?.[0]?.username}
      avatarUrl={farcasterProfiles?.[0]?.avatar}
      isConnected={isConnected}
    >
      {isConnected ? <DisconnectFarcasterButton /> : <ConnectFarcasterButton />}
    </SocialAccountUI>
  )
}

const ConnectFarcasterButton = ({
  onSuccess,
  isReconnection: _,
  ...props
}: ButtonProps & { onSuccess?: () => void; isReconnection?: boolean }) => {
  const { captureEvent } = usePostHogContext()
  const { farcasterProfiles, id: userId, mutate } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const fetcherWithSign = useFetcherWithSign()
  const toast = useToast()
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout>()

  const onApprove = () => {
    captureEvent("[farcaster] request approved")
    onClose()
    toast({
      status: "success",
      description: "Farcaster profile connected",
    })
    onSuccess?.()
  }

  const submitSignedKeyRequest = (
    signedPayload: SignedValidation
  ): Promise<{ url: string; deadline: number; deadlineRelative: number }> =>
    fetcher(`/v2/users/${userId}/farcaster-signed-keys`, signedPayload)

  const onRegenerate = () => {
    signedKeyRequest.onSubmit()
  }

  const { seconds, start, stop } = useCountdownSeconds(undefined, () => {
    captureEvent("[farcaster] deadline hit")
    onRegenerate()
  })
  const shouldEnableRegenerateButton = seconds < ENABLE_REGENERATE_BUTTON_AT_SEC

  const signedKeyRequest = useSubmitWithSign(submitSignedKeyRequest, {
    onSuccess: ({ deadlineRelative }) => {
      const deadline = Date.now() + deadlineRelative
      start(Math.floor(deadlineRelative / 1000) - POLL_EARLY_END_SEC) // 2 minuter earlier just for good measure

      if (pollInterval) {
        clearInterval(pollInterval)
      }

      setTimeout(() => {
        const interval = setInterval(() => {
          if (Date.now() > deadline) {
            clearInterval(interval)
          }

          fetcherWithSign([
            `/v2/users/${userId}/farcaster-profiles`,
            { method: "GET" },
          ])
            .then((profiles) => {
              if (profiles?.length > 0) {
                mutate(
                  (prev) => (prev ? { ...prev, farcasterProfiles: profiles } : prev),
                  {
                    revalidate: false,
                  }
                ).then(() => {
                  onApprove()
                  clearInterval(interval)
                })
              }
            })
            .catch(() => {})
        }, APPROVAL_POLL_INTERVAL_MS)

        setPollInterval(interval)
      }, APPROVAL_POLL_INITIAL_DELAY_MS)

      onOpen()
    },
  })

  const handleOnClose = () => {
    captureEvent("[farcaster] connect modal closed")
    stop()
    signedKeyRequest.reset()
    if (pollInterval) {
      clearInterval(pollInterval)
    }
    onClose()
  }

  const qrSize = useBreakpointValue({ base: 300, md: 400 })

  return (
    <>
      <Button
        onClick={() => {
          captureEvent("[farcaster] connect button clicked")
          signedKeyRequest.onSubmit()
        }}
        colorScheme={rewards.FARCASTER.colorScheme}
        variant={"solid"}
        size="sm"
        isDisabled={farcasterProfiles?.length > 0}
        isLoading={signedKeyRequest.isLoading}
        {...props}
      >
        Connect
      </Button>
      <Modal isOpen={isOpen} onClose={handleOnClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader pb={0} pr={16}>
            Scan the QR code
          </ModalHeader>
          <ModalBody pt={8}>
            <VStack justifyContent="center">
              <Skeleton isLoaded={!signedKeyRequest.isLoading} borderRadius={"md"}>
                {signedKeyRequest.response?.url && (
                  <Box borderRadius="md" borderWidth={3} overflow="hidden">
                    <QRCodeSVG
                      value={signedKeyRequest.response.url}
                      size={qrSize}
                      style={{ maxWidth: "100%" }}
                    />
                  </Box>
                )}
              </Skeleton>
              <HStack alignItems="center" mt={3}>
                <Text color={"gray"}>
                  The QR code will be regenerated in{" "}
                  {seconds > 60
                    ? `${Math.floor(seconds / 60)} minutes`
                    : `${seconds} seconds`}
                </Text>
                <Tooltip label="Regenerate now">
                  <IconButton
                    isDisabled={!shouldEnableRegenerateButton}
                    size="xs"
                    variant="ghost"
                    color="gray"
                    icon={<ArrowCounterClockwise />}
                    isLoading={signedKeyRequest.isLoading}
                    aria-label="Regenerate Farcaster QR code"
                    onClick={() => {
                      captureEvent("[farcaster] manual qr regeneration")
                      onRegenerate()
                    }}
                  />
                </Tooltip>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const DisconnectFarcasterButton = () => {
  const { captureEvent } = usePostHogContext()
  const disclosure = useDisclosure()
  const { farcasterProfiles, id, mutate } = useUser()
  const fetcherWithSign = useFetcherWithSign()
  const toast = useToast()

  const { onSubmit, isLoading } = useSubmit(
    async (fid?: number) => {
      if (!fid) {
        throw new Error("Failed to disconnect Farcaster profile. FID unknown")
      }

      await fetcherWithSign([
        `/v2/users/${id}/farcaster-profiles/${fid}`,
        { method: "DELETE" },
      ])

      await mutate((prev) => (prev ? { ...prev, farcasterProfiles: [] } : prev), {
        revalidate: false,
      })
    },
    {
      onSuccess: () => {
        toast({
          status: "success",
          description: "Farcaster profile disconnected",
        })
        disclosure.onClose()
      },
    }
  )
  const onConfirm = () => {
    captureEvent("[farcaster] disconnect button clicked")
    onSubmit(farcasterProfiles?.[0]?.fid)
  }

  return (
    <DisconnectAccountButton
      name={rewards.FARCASTER.name}
      loadingText="Removing"
      {...{ disclosure, isLoading, onConfirm }}
    />
  )
}

export { ConnectFarcasterButton }
export default FarcasterProfile
