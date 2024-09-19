import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog"
import { Button, ButtonProps } from "@/components/ui/Button"
import { IconButton } from "@/components/ui/IconButton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { DisclosureState } from "@/hooks/useDisclosure"
import { cn } from "@/lib/utils"
import { LinkBreak } from "@phosphor-icons/react/dist/ssr"

const DisconnectAccountButton = ({
  onConfirm,
  isLoading,
  loadingText,
  className,
  name,
  state: { isOpen, onClose, onOpen },
}: {
  onConfirm: () => void
  isLoading: ButtonProps["isLoading"]
  loadingText: ButtonProps["loadingText"]
  className?: ButtonProps["className"]
  name: string
  state: DisclosureState
}) => (
  <>
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          className={cn("size-8 rounded-full px-0", className)}
          colorScheme="destructive"
          variant="ghost"
          aria-label="Disconnect account"
          onClick={onOpen}
          icon={<LinkBreak weight="bold" className="size-3" />}
        />
      </TooltipTrigger>
      <TooltipContent>
        <span>Disconnect account</span>
      </TooltipContent>
    </Tooltip>

    <AlertDialog open={isOpen}>
      <AlertDialogContent onEscapeKeyDown={onClose}>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Disconnect ${name} account`}</AlertDialogTitle>
          <AlertDialogDescription>
            {`Are you sure? This account will lose every Guild gated access on ${name}.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              colorScheme="destructive"
              onClick={onConfirm}
              isLoading={isLoading}
              loadingText={loadingText}
            >
              Disconnect
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
)

export { DisconnectAccountButton }
