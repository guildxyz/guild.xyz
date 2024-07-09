import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { useAtom } from "jotai"
import rewards from "rewards"
import capitalize from "utils/capitalize"
import shortenHex from "utils/shortenHex"
import { CopyableAddress } from "../CopyableAddress"
import { platformMergeAlertAtom } from "../Providers/atoms"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/AlertDialog"
import { useToast } from "../ui/hooks/useToast"
import { useWeb3ConnectionManager } from "./hooks/useWeb3ConnectionManager"

const PlatformMergeErrorAlert = () => {
  const { address } = useWeb3ConnectionManager()
  const { toast } = useToast()
  const [state, setState] = useAtom(platformMergeAlertAtom)
  const { addressOrDomain, platformName } = state || {}

  const socialAccountName = rewards[platformName]?.name ?? "social"
  const { onConnect, isLoading } = useConnectPlatform(
    platformName ?? "DISCORD",
    () => {
      toast({
        variant: "success",
        title: "Successful connect",
        description: `${capitalize(
          socialAccountName
        )} account successfully disconnected from old address, and connected to this one`,
      })
      setState(false)
    },
    undefined,
    undefined,
    true
  )

  return (
    <>
      <AlertDialog
        open={!!state}
        onOpenChange={(open) => {
          if (!open) setState(false)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`${capitalize(socialAccountName)} account already connected`}</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4">
            <p>
              This {socialAccountName} account is already connected to this address:{" "}
              {addressOrDomain?.startsWith("0x") ? (
                <CopyableAddress address={addressOrDomain} decimals={4} />
              ) : (
                <span className="font-semibold">{addressOrDomain}</span>
              )}
            </p>

            <p className="font-bold">You have two options to choose from:</p>

            <ul>
              <li className="mb-2">
                Switch to the address above and link your current address (
                <span className="font-semibold">
                  {address ? shortenHex(address) : ""}
                </span>
                ) to it by following {/* TODO: blue link color */}
                <a
                  target="_blank"
                  href={
                    "https://help.guild.xyz/en/articles/6947559-how-to-un-link-wallet-addresses"
                  }
                >
                  this guide
                  <ArrowSquareOut className="ml-1 inline" weight="bold" />
                </a>
              </li>

              <li>
                Continue connecting the account to the current address (it'll
                disconnect it from the above one, losing any accesses you had with
                that)
              </li>
            </ul>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {/* TODO: loading state */}
            <AlertDialogAction /* isLoading={isLoading} */ onClick={onConnect}>
              Connect anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export { PlatformMergeErrorAlert }
