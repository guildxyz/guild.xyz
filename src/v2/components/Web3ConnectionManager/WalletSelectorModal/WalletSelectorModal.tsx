import { Error as ErrorComponent } from "@/components/Error"
import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import {
  addressLinkParamsAtom,
  walletLinkHelperModalAtom,
} from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { Anchor, anchorVariants } from "@/components/ui/Anchor"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import { usePrevious } from "@/hooks/usePrevious"
import { useUserPublic } from "@/hooks/useUserPublic"
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"
import useSetKeyPair from "hooks/useSetKeyPair"
import { useAtom, useSetAtom } from "jotai"
import { useEffect } from "react"
import { type Connector, useAccount, useConnect } from "wagmi"
import { COINBASE_INJECTED_WALLET_ID, COINBASE_WALLET_SDK_ID } from "wagmiConfig"
import AccountButton from "./components/AccountButton"
import ConnectorButton from "./components/ConnectorButton"
import { ExportCWaaSLink } from "./components/ExportCWaaSLink"
import FuelConnectorButtons from "./components/FuelConnectorButtons"
import useIsWalletConnectModalActive from "./hooks/useIsWalletConnectModalActive"
import useLinkAddress from "./hooks/useLinkAddress"
import processConnectionError from "./utils/processConnectionError"

type Props = {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

const WalletSelectorModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const { isWeb3Connected, isInSafeContext, disconnect, address } =
    useWeb3ConnectionManager()

  const { connectors, error, connect, variables, isPending } = useConnect()

  /**
   * If we can't detect an EIP-6963 compatible wallet, we fallback to a general
   * injected wallet option
   */
  const shouldShowInjected =
    typeof window !== "undefined" &&
    !!window.ethereum &&
    connectors
      .filter((c) => c.id !== COINBASE_INJECTED_WALLET_ID)
      .filter((c) => c.type === "injected").length === 1

  const { connector, status } = useAccount()

  const [addressLinkParams, setAddressLinkParams] = useAtom(addressLinkParamsAtom)
  const isAddressLink = !!addressLinkParams?.userId

  const { captureEvent } = usePostHogContext()

  const { keyPair, id, error: publicUserError } = useUserPublic()
  const set = useSetKeyPair({
    onError: (err) => {
      /**
       * Needed temporarily for debugging WalletConnect issues (GUILD-2423) Checking
       * for Error instance to filter out fetcher-thrown errors, which are irrelevant
       * here
       */
      if (err instanceof Error) {
        captureEvent("[verify] - failed", {
          errorMessage: err.message,
          errorStack: err.stack,
          errorCause: err.cause,
          wagmiAccountStatus: status,
        })
      }
    },
  })

  useEffect(() => {
    if (keyPair && !isAddressLink) onClose()
  }, [keyPair, isAddressLink, onClose])

  const isConnectedAndKeyPairReady = isWeb3Connected && !!id

  const isWalletConnectModalActive = useIsWalletConnectModalActive()

  const linkAddress = useLinkAddress()

  const shouldShowVerify =
    isWeb3Connected && (!!publicUserError || (!!id && !keyPair))

  const setIsWalletLinkHelperModalOpen = useSetAtom(walletLinkHelperModalAtom)
  useEffect(() => {
    if (!isWeb3Connected) return
    setIsWalletLinkHelperModalOpen(false)
  }, [isWeb3Connected, setIsWalletLinkHelperModalOpen])

  const prevAddress = usePrevious(address)
  const triesToLinkCurrentAddress =
    isAddressLink &&
    !shouldShowVerify &&
    !prevAddress &&
    address === addressLinkParams.address

  const showErrorToast = useErrorToast()

  useEffect(() => {
    if (!triesToLinkCurrentAddress) return
    setAddressLinkParams({ userId: undefined, address: undefined })

    showErrorToast(
      "You cannot link an address to itself. Please choose a different address."
    )
  }, [triesToLinkCurrentAddress, setAddressLinkParams, showErrorToast])

  const conditionalOnClose = () => {
    if (!isWeb3Connected || !!keyPair) onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) return
        setTimeout(() => {
          disconnect()
        }, 200)
      }}
    >
      <DialogContent
        onPointerDownOutside={conditionalOnClose}
        onEscapeKeyDown={conditionalOnClose}
        trapFocus={!isWalletConnectModalActive}
        data-testid="connect-wallet-dialog"
      >
        <DialogHeader className="flex-row items-center gap-1.5">
          <DialogTitle className="-mt-1">
            {isAddressLink ? "Link address" : "Connect to Guild"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <ErrorComponent
            {...(set.error || linkAddress.error
              ? {
                  error: set.error ?? linkAddress.error,
                  processError: (err: any) => {
                    if (err?.code === "ACTION_REJECTED") {
                      return {
                        title: "Rejected",
                        description: "Signature request has been rejected",
                      }
                    }

                    return {
                      title: "Error",
                      description:
                        err?.message ??
                        (typeof err?.error === "string"
                          ? err?.error
                          : typeof err === "string"
                            ? err
                            : err?.errors?.[0]?.msg),
                    }
                  },
                }
              : { error, processError: processConnectionError })}
          />

          {shouldShowVerify && (
            <p className="mb-6">
              Sign message to verify that you're the owner of this address.
            </p>
          )}

          {isWeb3Connected ? (
            <AccountButton />
          ) : (
            <div className="flex w-full flex-col">
              {!connector && !addressLinkParams?.userId && (
                <>
                  <ConnectorButton
                    key={COINBASE_WALLET_SDK_ID}
                    connector={connectors.find(
                      (conn) => conn.id === COINBASE_WALLET_SDK_ID
                    )}
                    connect={connect}
                    pendingConnector={
                      isPending ? (variables?.connector as Connector) : undefined
                    }
                    error={error}
                  />

                  <p className="mt-6 mb-2 font-bold text-muted-foreground text-xs uppercase">
                    Or connect with wallet
                  </p>
                </>
              )}

              <div className="flex flex-col gap-2">
                {connectors
                  .filter(
                    (conn) =>
                      conn.id !== COINBASE_WALLET_SDK_ID &&
                      (isInSafeContext || conn.id !== "safe") &&
                      (shouldShowInjected || conn.id !== "injected") &&
                      // Filtering Coinbase Wallet, since we use the `coinbaseWallet` connector for it
                      conn.id !== COINBASE_INJECTED_WALLET_ID
                  )
                  .sort((conn, _) => (conn.type === "injected" ? -1 : 0))
                  .map((conn) => (
                    <ConnectorButton
                      key={conn.id}
                      connector={conn}
                      connect={connect}
                      pendingConnector={
                        isPending ? (variables?.connector as Connector) : undefined
                      }
                      error={error}
                    />
                  ))}
                <FuelConnectorButtons key="fuel" />
                <ExportCWaaSLink />
              </div>
            </div>
          )}

          {shouldShowVerify && (
            <Button
              size="xl"
              colorScheme="success"
              onClick={() => {
                if (isAddressLink) {
                  return linkAddress.onSubmit(addressLinkParams)
                }
                return set.onSubmit()
              }}
              disabled={!id && !publicUserError}
              isLoading={
                linkAddress.isLoading || set.isLoading || (!id && !publicUserError)
              }
              loadingText={!id ? "Looking for keypairs" : "Check your wallet"}
              className="mb-4 w-full"
              data-testid="verify-address-button"
            >
              {isAddressLink ? "Link address" : "Verify address"}
            </Button>
          )}
        </DialogBody>

        <DialogFooter>
          {!isConnectedAndKeyPairReady ? (
            <div className="flex w-full flex-col gap-2 text-center text-sm">
              <p className="text-muted-foreground">
                <span>{"New to Ethereum wallets? "}</span>
                <a
                  href="https://ethereum.org/en/wallets"
                  target="_blank"
                  className={anchorVariants({
                    variant: "highlighted",
                    className: "inline-flex items-center gap-1",
                  })}
                >
                  Learn more
                  <ArrowSquareOut />
                </a>
              </p>

              <p className="text-muted-foreground">
                <span>{"By continuing, you agree to our "}</span>
                <Anchor
                  href="/privacy-policy"
                  variant="muted"
                  className="font-semibold"
                  onClick={onClose}
                >
                  Privacy Policy
                </Anchor>
                <span>{" and "}</span>
                <Anchor
                  href="/terms-of-use"
                  variant="muted"
                  className="font-semibold"
                  onClick={onClose}
                >
                  Terms & conditions
                </Anchor>
              </p>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-2 text-center text-sm">
              <p className="text-muted-foreground">
                Signing the message doesn't cost any gas
              </p>
              <p className="text-muted-foreground">
                <span>{"This site is protected by reCAPTCHA, so the Google "}</span>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  className={anchorVariants({
                    variant: "muted",
                    className: "font-semibold",
                  })}
                >
                  Privacy Policy
                </a>{" "}
                <span>{"and "}</span>
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  className={anchorVariants({
                    variant: "muted",
                    className: "font-semibold",
                  })}
                >
                  Terms of Service
                </a>
                <span>{" apply"}</span>
              </p>
            </div>
          )}
        </DialogFooter>

        <DialogCloseButton onClick={conditionalOnClose} />
      </DialogContent>
    </Dialog>
  )
}

export default WalletSelectorModal
