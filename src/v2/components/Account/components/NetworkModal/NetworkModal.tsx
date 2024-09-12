import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { useDisclosure } from "@/hooks/useDisclosure"
import NetworkButtonsList from "./NetworkButtonsList"

const NetworkModal = ({
  isOpen,
  onClose,
}: {
  isOpen: ReturnType<typeof useDisclosure>["isOpen"]
  onClose: ReturnType<typeof useDisclosure>["onClose"]
}) => (
  <Dialog open={isOpen}>
    <DialogContent
      onPointerDownOutside={onClose}
      onEscapeKeyDown={onClose}
      size="4xl"
      /** temporary to support opening NetworkModal from the account Popover, we'll be able to remove
       * all zIndexes when getting rid of Chakra, and so will be able to remove this */
      overlayClasses="z-popover"
    >
      <DialogCloseButton onClick={onClose} />
      <DialogHeader>
        <DialogTitle>Supported networks</DialogTitle>
      </DialogHeader>

      <DialogBody className="gap-4">
        <p className="text-muted-foreground">
          It doesn't matter which supported chain you're connected to, it's only used
          to know your address and sign messages so each will work equally.
        </p>

        <NetworkButtonsList networkChangeCallback={onClose} />
      </DialogBody>
    </DialogContent>
  </Dialog>
)

export default NetworkModal
