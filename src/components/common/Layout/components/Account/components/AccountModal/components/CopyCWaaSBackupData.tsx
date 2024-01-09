import { Icon, IconButton, Text, Tooltip, VStack } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
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

  const tryToCopyBackup = (backupStr: string) => {
    setBackup(backupStr)
    return navigator.clipboard
      .writeText(backupStr)
      .then(() => true)
      .catch(() => false)
      .then((success) => {
        if (!success) {
          throw new Error(
            "Failed to copy to clipboard. If you see a browser popup, allow the website to access the clipboard"
          )
        } else {
          captureEvent("[WaaS Backup] Backup data copied")
          toast({
            status: "success",
            title: "Copied",
            description: "Backup data copied to clipboard",
          })
        }
      })
  }

  const copyBackup = useSubmit(
    async () => {
      captureEvent("[WaaS Backup] Clicked copy backup data")

      if (!!backup) {
        await tryToCopyBackup(backup)
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

      toast({
        status: "info",
        title: "Backup downloaded",
        description: (
          <VStack alignItems={"start"}>
            <Text>Click the button below to copy it to the clipboard</Text>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                tryToCopyBackup(backupData).catch((err) => {
                  toast({
                    status: "error",
                    title: "Failed",
                    description: err?.message ?? "Unknown error",
                  })
                })
              }}
            >
              Copy
            </Button>
          </VStack>
        ),
      })
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
        icon={<Icon as={Copy} p="1px" />}
        aria-label="Disconnect"
      />
    </Tooltip>
  )
}

export default CopyCWaaSBackupData
