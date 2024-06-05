import { Icon, IconButton, Tooltip, useClipboard } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useSubmit from "hooks/useSubmit"
import useToast, { useToastWithButton } from "hooks/useToast"
import { Check, CloudArrowDown, Copy } from "phosphor-react"
import { useEffect } from "react"
import { useAccount } from "wagmi"
import useDriveOAuth from "../hooks/useDriveOAuth"
import { getDriveFileAppProperties, listWalletsOnDrive } from "../utils/googleDrive"

const CopyWaaSPrivateKey = () => {
  const { captureEvent } = usePostHogContext()
  const driveOAuth = useDriveOAuth()
  const toast = useToast()
  const toastWithButton = useToastWithButton()
  const {
    onCopy,
    setValue: setPrivateKey,
    value: privateKey,
    hasCopied,
  } = useClipboard("", 4000)
  const { connector } = useAccount()

  useEffect(() => {
    if (!hasCopied) return

    toast({
      status: "success",
      title: "Copied!",
      description:
        "Private key successfully copied to the clipboard, you can now paste it into a wallet app",
    })
  }, [hasCopied, toast])

  // This toast is needed, because we can't copy to clipboard immediately after the submit, due to browser limitations
  useEffect(() => {
    if (!privateKey) return

    toastWithButton({
      status: "info",
      title: "Private key generated",
      description: "Click the button below to copy it to the clipboard!",
      buttonProps: {
        onClick: onCopy,
        leftIcon: <Copy />,
        isDisabled: hasCopied,
        children: "Copy",
      },
    })
  }, [privateKey, toastWithButton, onCopy, hasCopied])

  const copyBackup = useSubmit(
    async () => {
      captureEvent("[WaaS Backup] Clicked copy backup data")

      if (!!privateKey) {
        onCopy()
        return
      }

      const { authData, error } = await driveOAuth.onOpen()
      if (error || !authData) {
        throw new Error("Google authentication failed")
      }
      captureEvent("[WaaS Backup] Drive OAuth successful")

      const {
        files: [wallet = null],
      } = await listWalletsOnDrive(authData.access_token)

      if (!wallet) {
        throw new Error("No wallet found on Drive")
      }
      captureEvent("[WaaS Backup] Wallet file found")

      const {
        appProperties: { backupData = null },
      } = await getDriveFileAppProperties(wallet.id, authData.access_token)

      if (!backupData) {
        throw new Error("No backup data found on wallet file")
      }
      captureEvent("[WaaS Backup] Backup data found")

      // connector is always waas connector here
      const pk = await (connector as any).exportKeys(backupData).catch(() => null)

      if (!pk?.[0]?.ecKeyPrivate) {
        throw new Error(
          "Failed to export private key, make sure to authenticate with the correct Google account"
        )
      }

      setPrivateKey(pk[0].ecKeyPrivate)
    },
    {
      onError: (error) => {
        captureEvent("[WaaS Backup] Failed to copy backup data", {
          error,
          message: error?.message,
        })

        toast({
          status: "error",
          title: "Failed",
          description: error?.message ?? "Unknown error",
        })
      },
    }
  )

  return (
    <Tooltip label="Export wallet private key">
      <IconButton
        size="sm"
        variant="outline"
        onClick={copyBackup.onSubmit}
        isLoading={copyBackup.isLoading}
        icon={<Icon as={hasCopied ? Check : CloudArrowDown} />}
        aria-label="Export wallet private key"
      />
    </Tooltip>
  )
}

export default CopyWaaSPrivateKey
