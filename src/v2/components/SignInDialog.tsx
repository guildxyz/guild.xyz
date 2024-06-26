import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { ArrowSquareOut, SignIn } from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import coinbaseWalletImage from "/public/walletLogos/coinbasewallet.png"
import { Badge } from "./ui/Badge"

export function SignInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="space-x-2" size="lg">
          <SignIn className="size-4" />
          <span>Sign in</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-8">
          <DialogTitle>Connect to Guild</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-stretch gap-2">
          <Button
            variant="accent"
            className="mb-4 items-center justify-start gap-2"
            size="lg"
          >
            <Image src={coinbaseWalletImage} alt="coinbase" className="size-6" />
            <span>Sign in with Smart Wallet</span>
          </Button>
          <div className="text-xs font-extrabold text-muted-foreground">
            OR CONNECT WITH WALLET
          </div>
          <Button
            variant="accent"
            className="items-center justify-start gap-2"
            size="lg"
          >
            <Image src={coinbaseWalletImage} alt="metamask" className="size-6" />
            <span>MetaMask</span>
          </Button>
          <Button
            variant="accent"
            className="items-center justify-start gap-2"
            size="lg"
          >
            <Image
              src={coinbaseWalletImage}
              alt="walletconnect"
              className="size-6"
            />
            <span>WalletConnect</span>
          </Button>
          <Button
            variant="accent"
            className="items-center justify-start gap-2"
            size="lg"
          >
            <Image src={coinbaseWalletImage} alt="google" className="size-6" />
            <span>Google</span>
            <Badge className="ml-auto font-normal">Deprecated</Badge>
          </Button>
        </div>
        <div className="flex flex-col gap-4 text-center text-sm text-card-foreground">
          <p>
            <span>New to Ethereum wallets? </span>
            <Link
              href="https://ethereum.org/en/wallets/"
              target="_blank"
              className="space-x-1"
            >
              <span>Learn more</span>
              <ArrowSquareOut className="inline-block" />
            </Link>
          </p>
          <p>
            <span>By continuing, you agree to our </span>
            <Link href="/privacy-policy" target="_blank">
              Privacy Policy
            </Link>
            <span> and </span>
            <Link href="/terms-of-use">Terms & conditions</Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
