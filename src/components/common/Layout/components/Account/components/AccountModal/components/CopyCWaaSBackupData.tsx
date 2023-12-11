import { Icon, IconButton, Tooltip } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useDriveOAuth from "hooks/useDriveOAuth"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Copy } from "phosphor-react"
import { useState } from "react"
import { getDriveFileAppProperties, listWalletsOnDrive } from "utils/googleDrive"

const CopyCWaaSBackupData = () => {
  const { captureEvent } = usePostHogContext()
  const driveOAuth = useDriveOAuth()
  const toast = useToast()
  const [backup, setBackup] = useState<string>()

  const copyBackup = useSubmit(
    async () => {
      captureEvent("Clicked copy backup data")

      if (!!backup) {
        const success = await navigator.clipboard
          .writeText(backup)
          .then(() => true)
          .catch((err) => {
            console.error(err)
            return false
          })

        if (!success) {
          throw new Error(
            "Failed to copy to clipboard. If you see a browser popup, allow the website to access the clipboard"
          )
        }

        return
      }

      const { authData, error } = await driveOAuth.onOpen()
      if (error) {
        throw new Error("Google authentication failed")
      }

      const {
        files: [wallet = null],
      } = await listWalletsOnDrive(authData.access_token)

      if (!wallet) {
        throw new Error("No wallet found on Drive")
      }

      const {
        appProperties: { backupData = null },
      } = await getDriveFileAppProperties(wallet.id, authData.access_token)

      if (!backupData) {
        throw new Error("No backup data found on wallet file")
      }

      setBackup(backupData)

      const success = await navigator.clipboard
        .writeText(backupData)
        .then(() => true)
        .catch((err) => {
          console.error(err)
          return false
        })

      if (!success) {
        throw new Error(
          "Failed to copy to clipboard. If you see a browser popup, allow the website to access the clipboard"
        )
      }
    },
    {
      onSuccess: () => {
        captureEvent("Successfully copied backup data")

        toast({
          status: "success",
          title: "Copied",
          description: "Backup data copied to clipboard",
        })
      },
      onError: (error) => {
        captureEvent("Failed to copy backup data", {
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
        icon={<Icon as={Copy} p="1px" />}
        aria-label="Disconnect"
      />
    </Tooltip>
  )
}

export default CopyCWaaSBackupData
