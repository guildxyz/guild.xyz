"use client"

import { useDisclosure } from "@/hooks/useDisclosure"
import { useEffect } from "react"
import { useIsClient, useLocalStorage } from "usehooks-ts"
import { Button } from "./ui/Button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog"

const ANNOUNCEMENT_LOCALSTORAGE_ID = "announcement-lowered-nft-fees-2024-dec-11"

export const AnnouncementDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isClient = useIsClient()

  const [hasSeenAnnouncement, setHasSeenAnnouncement] = useLocalStorage(
    ANNOUNCEMENT_LOCALSTORAGE_ID,
    false
  )

  useEffect(() => {
    if (!isClient || hasSeenAnnouncement) return
    onOpen()
  }, [isClient, hasSeenAnnouncement, onOpen])

  return (
    <Dialog open={isOpen}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Minting fees reduced by 60% 🎉</DialogTitle>
        </DialogHeader>

        <DialogBody className="prose text-foreground">
          <p>
            Building your onchain identity just got easier. Collect Guild Pins and
            NFT rewards and show off your favorite communities!
          </p>
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={() => {
              setHasSeenAnnouncement(true)
              onClose()
            }}
            colorScheme="primary"
            className="w-full"
          >
            LFG 🚀
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
