import { Icon, IconButton, Tooltip, useClipboard } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useSubmit from "hooks/useSubmit"
import useToast, { useToastWithButton } from "hooks/useToast"
import { Check, CloudArrowDown, Copy } from "phosphor-react"
import { useEffect } from "react"
import useDriveOAuth from "../hooks/useDriveOAuth"
import { getDriveFileAppProperties, listWalletsOnDrive } from "../utils/googleDrive"

const CopyCWaaSBackupData = () => {
  const { captureEvent } = usePostHogContext()
  const driveOAuth = useDriveOAuth()
  const toast = useToast()
  const toastWithButton = useToastWithButton()
  const {
    onCopy,
    setValue: setBackup,
    value: backup,
    hasCopied,
  } = useClipboard("", 4000)

  useEffect(() => {
    if (!hasCopied) return

    toast({
      status: "success",
      title: "Copied!",
      description: "Backup data successfully copied to the clipboard",
    })
  }, [hasCopied, toast])

  // This toast is needed, because we can't copy to clipboard immediately after the submit, due to browser limitations
  useEffect(() => {
    if (!backup) return

    toastWithButton({
      status: "info",
      title: "Backup downloaded",
      description: "Click the button below to copy it to the clipboard!",
      buttonProps: {
        onClick: onCopy,
        leftIcon: <Copy />,
        isDisabled: hasCopied,
        children: "Copy",
      },
    })
  }, [backup, toastWithButton, onCopy, hasCopied])

  const copyBackup = useSubmit(
    async () => {
      captureEvent("[WaaS Backup] Clicked copy backup data")

      if (!!backup) {
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
      setBackup(backupData)
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
    <Tooltip label="Copy wallet backup data">
      <IconButton
        size="sm"
        variant="outline"
        onClick={copyBackup.onSubmit}
        isLoading={copyBackup.isLoading}
        icon={<Icon as={hasCopied ? Check : CloudArrowDown} />}
        aria-label="Copy wallet backup data"
      />
    </Tooltip>
  )
}

export default CopyCWaaSBackupData
