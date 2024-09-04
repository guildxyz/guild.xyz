import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion"
import { Button, ButtonProps, buttonVariants } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/Skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { useToast } from "@/components/ui/hooks/useToast"
import { useDisclosure } from "@/hooks/useDisclosure"
import { cn } from "@/lib/utils"
import { FarcasterProfile as FarcasterProfileType } from "@guildxyz/types"
import {
  ArrowCounterClockwise,
  DeviceMobileCamera,
} from "@phosphor-icons/react/dist/ssr"
import useUser from "components/[guild]/hooks/useUser"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import useSubmit, { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { QRCodeSVG } from "qrcode.react"
import { useCallback, useEffect, useState } from "react"
import { isMobile } from "react-device-detect"
import { farcasterData } from "rewards/Farcaster/data"
import { useCountdown } from "usehooks-ts"
import fetcher from "utils/fetcher"
import { DisconnectAccountButton } from "./DisconnectAccountButton"
import { SocialAccountUI } from "./SocialAccount"

// Polling will only start after this much time
const APPROVAL_POLL_INITIAL_DELAY_MS = 15_000
// Delay between polls
const APPROVAL_POLL_INTERVAL_MS = 5000
// Enable the manual QR regeneration button, when less than this much seconds is left
const ENABLE_REGENERATE_BUTTON_AT_SEC = 10 * 60

const FarcasterProfile = () => {
  const { farcasterProfiles } = useUser()
  const isConnected = farcasterProfiles?.length > 0

  return (
    <SocialAccountUI
      type="FARCASTER"
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
  const { toast } = useToast()
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout>()

  const fetcherWithSign = useFetcherWithSign()
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const onApprove = () => {
    captureEvent("[farcaster] request approved")
    onClose()
    toast({
      variant: "success",
      description: "Farcaster profile connected",
    })
    onSuccess?.()
  }

  const submitSignedKeyRequest = (
    signedPayload: SignedValidation
  ): Promise<
    | { url: string; deadline: number; deadlineRelative: number }
    | ({ usedExistingKey: true } & FarcasterProfileType)
  > => fetcher(`/v2/users/${userId}/farcaster-signed-keys`, signedPayload)

  const [seconds, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 11 * 60 - 1, // -1 Just so we don't show "11 minutes" for a second at start
  })

  const shouldEnableRegenerateButton = seconds < ENABLE_REGENERATE_BUTTON_AT_SEC

  const signedKeyRequest = useSubmitWithSign(submitSignedKeyRequest, {
    onSuccess: (response) => {
      if ("usedExistingKey" in response) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { usedExistingKey, ...profile } = response
        mutate((prev) => (prev ? { ...prev, farcasterProfiles: [profile] } : prev), {
          revalidate: false,
        }).then(() => {
          onApprove()
        })
        return
      }

      const { deadlineRelative } = response

      const deadline = Date.now() + deadlineRelative
      startCountdown()

      if (pollInterval) {
        clearInterval(pollInterval)
      }

      setTimeout(() => {
        const interval = setInterval(() => {
          if (Date.now() > deadline) {
            clearInterval(interval)
          }

          fetcherWithSign(
            getKeyForSWRWithOptionalAuth(`/v2/users/${userId}/farcaster-profiles`)
          )
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

  const onRegenerate = useCallback(() => {
    resetCountdown()
    signedKeyRequest.onSubmit()
  }, [signedKeyRequest, resetCountdown])

  useEffect(() => {
    if (seconds > 0) return

    captureEvent("[farcaster] deadline hit")
    onRegenerate()
  }, [seconds, resetCountdown, captureEvent, onRegenerate])

  const handleOnClose = () => {
    captureEvent("[farcaster] connect modal closed")
    stop()
    signedKeyRequest.reset()
    if (pollInterval) {
      clearInterval(pollInterval)
    }
    onClose()
  }

  const url =
    signedKeyRequest.response && "url" in signedKeyRequest.response
      ? signedKeyRequest.response.url
      : null

  return (
    <>
      <Button
        onClick={() => {
          captureEvent("[farcaster] connect button clicked")
          signedKeyRequest.onSubmit()
        }}
        size="sm"
        disabled={farcasterProfiles?.length > 0}
        isLoading={signedKeyRequest.isLoading}
        className="ml-auto bg-farcaster text-white hover:bg-farcaster-hover active:bg-farcaster-active"
        {...props}
      >
        Connect
      </Button>

      <Dialog open={isOpen}>
        <DialogContent
          onEscapeKeyDown={handleOnClose}
          onPointerDownOutside={handleOnClose}
        >
          <DialogCloseButton onClick={handleOnClose} />

          <DialogHeader>
            <DialogTitle className="flex gap-1">
              {isMobile ? (
                "Connect Farcaster"
              ) : (
                <>
                  <DeviceMobileCamera weight="bold" className="size-6" />
                  <span>Scan With your phone</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            <div className="flex flex-col justify-center">
              {signedKeyRequest.isLoading ? (
                <Skeleton className="aspect-square w-full" />
              ) : (
                !isMobile &&
                url && (
                  <div className="overflow-hidden rounded-md border-2">
                    <QRCodeSVG
                      value={url}
                      size={300}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )
              )}

              <div className="mt-2 flex justify-center">
                <p className="text-muted-foreground text-sm">
                  {isMobile
                    ? "The link is active for "
                    : "The QR code will be regenerated in "}
                  {seconds > 60
                    ? `${Math.floor(seconds / 60)} minutes`
                    : `${seconds} seconds`}
                </p>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="w-6 px-0 text-muted-foreground"
                      disabled={!shouldEnableRegenerateButton}
                      isLoading={signedKeyRequest.isLoading}
                      aria-label="Regenerate Farcaster QR code"
                      onClick={() => {
                        captureEvent("[farcaster] manual qr regeneration")
                        onRegenerate()
                      }}
                    >
                      <ArrowCounterClockwise weight="bold" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Regenerate now</span>
                  </TooltipContent>
                </Tooltip>
              </div>

              <p className="text-center text-muted-foreground text-sm">
                One Farcaster account can only be connected to{" "}
                <strong>one Guild account</strong> at a time
              </p>

              <Separator className="mt-4" />

              <Accordion type="single" collapsible>
                <AccordionItem
                  value="write-access"
                  className="text-muted-foreground text-sm"
                >
                  <AccordionTrigger>
                    Why does Guild request write access?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Guild is a Farcaster client. You can perform Farcaster actions,
                      like follow, or recast to satisfy requirements. You can also
                      perform these actions in external Farcaster clients, like
                      Warpcast, but it will take some time for Guild to grant access
                      based on actions in external clients
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DialogBody>

          {isMobile && (
            <DialogFooter>
              <a
                href={url}
                target="_blank"
                className={cn(
                  buttonVariants(),
                  "w-full bg-farcaster text-white hover:bg-farcaster-hover active:bg-farcaster-active"
                )}
              >
                Connect Farcaster
              </a>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

const DisconnectFarcasterButton = () => {
  const { captureEvent } = usePostHogContext()
  const disclosure = useDisclosure()
  const { farcasterProfiles, id, mutate } = useUser()
  const fetcherWithSign = useFetcherWithSign()
  const { toast } = useToast()

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
          variant: "success",
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
      name={farcasterData.name}
      loadingText="Removing"
      className="ml-auto"
      {...{ state: disclosure, isLoading, onConfirm }}
    />
  )
}

export { ConnectFarcasterButton }
export default FarcasterProfile
