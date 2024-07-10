import { SignOut } from "@phosphor-icons/react/dist/ssr"
import { useAtom } from "jotai"
import { walletLinkHelperModalAtom } from "../Providers/atoms"
import { Button } from "../ui/Button"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog"

const WalletLinkHelperModal = () => {
  const [isWalletLinkHelperModalOpen, setIsWalletLinkModalOpen] = useAtom(
    walletLinkHelperModalAtom
  )

  return (
    <Dialog
      open={isWalletLinkHelperModalOpen}
      onOpenChange={setIsWalletLinkModalOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link address</DialogTitle>
        </DialogHeader>

        <p>
          Please switch to the account you want to link and connect with it in your
          wallet!
        </p>
        <div className="mt-4 min-h-96 overflow-hidden rounded-lg">
          <video src="/videos/metamask-switch-account.webm" muted autoPlay loop>
            Your browser does not support the HTML5 video tag.
          </video>
        </div>

        <div className="flex w-full items-center gap-4 py-4">
          <hr className="w-full border-border" />
          <span className="text-xs font-bold text-muted-foreground">OR</span>
          <hr className="w-full border-border" />
        </div>

        <Button onClick={() => setIsWalletLinkModalOpen(false)} className="w-full">
          Connect another wallet
          <SignOut weight="bold" className="ml-1.5" />
        </Button>
        <DialogCloseButton />
      </DialogContent>
    </Dialog>
  )
}
export default WalletLinkHelperModal