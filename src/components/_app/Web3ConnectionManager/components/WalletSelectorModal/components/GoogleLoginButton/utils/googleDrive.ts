import fetcher from "utils/fetcher"

const BACKUP_DESCRIPTION = `DO NOT DELETE OR SHARE THIS FILE WITH ANYONE!\n\nThis file contains backup information of the following Coinbase wallet: ADDRESS_PLACEHOLDER\n\nThis backup information is required for accessing the wallet. If this information is lost or compromised, neither Coinbase nor Guild will be able to help you.\n\nFeel free to move this file to a different location on your Google Drive, just make sure you don't move it to a shared location!\n\nFor extra security, this backup only works in it's current state on Google Drive: if you download it, then re-upload it, the re-uploaded file won't work, and you WON'T BE ABLE TO ACCESS YOUR WALLET!`
const DRIVE_MULTIPART_UPLOAD_URL = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`
const DRIVE_FILES_LIST_URL = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
  "appProperties has { key='isGuildWallet' and value='true' }"
)}`

export class DriveRequestFailed extends Error {
  isMissingScope = false

  constructor(error: unknown) {
    super("Google Drive request failed")

    this.isMissingScope = (error as any)?.error?.status === "PERMISSION_DENIED"

    if (this.isMissingScope) {
      this.message =
        "Missing permissions. Please try again, and make sure to give access to Google Drive"
    }

    this.cause = error
  }
}

export const uploadBackupDataToDrive = (
  backupData: string,
  address: string,
  accessToken: string
) => {
  const createdAt = Date.now()
  const fileName = `guild-backup-${createdAt}.wallet`
  const addr = address.toLowerCase()

  const formData = new FormData()

  formData.append(
    "metadata",
    new Blob(
      [
        JSON.stringify({
          name: fileName,
          description:
            "DO NOT DELETE THIS FILE! IT IS NEEDED TO ACCESS A CRYPTO WALLET!",

          // A collection of arbitrary key-value pairs which are private to the requesting app
          appProperties: {
            createdAt,
            isGuildWallet: true,
            address: addr,
            backupData,
          },

          // Restrictions for accessing the content of the file
          contentRestrictions: [
            {
              readOnly: true,
              reason:
                "File has been automatically locked by Guild due to containing critical information",
            },
          ],

          // Whether the options to copy, print, or download this file, should be disabled for readers and commenters
          copyRequiresWriterPermission: true,
        }),
      ],
      {
        type: "application/json; charset=UTF-8",
      }
    )
  )

  formData.append(
    "media",
    new File(
      [
        `${BACKUP_DESCRIPTION.replace("ADDRESS_PLACEHOLDER", addr).replace(
          "BACKUP_PLACEHOLDER",
          backupData
        )}`,
      ],
      fileName,
      {
        type: "text/plain",
      }
    )
  )

  return fetch(DRIVE_MULTIPART_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  }).catch((error) => {
    console.error(error)
    throw new DriveRequestFailed(error)
  })
}

type DriveFileList = {
  kind: "drive#fileList"
  incompleteSearch: boolean
  files: Array<{
    kind: "drive#file"
    mimeType: string
    id: string
    name: string
  }>
}

export const listWalletsOnDrive = (accessToken: string): Promise<DriveFileList> =>
  fetcher(DRIVE_FILES_LIST_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch((error) => {
    console.error(error)
    throw new DriveRequestFailed(error)
  })

export const getFileFromDrive = (fileId: string, accessToken: string) =>
  fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((resp) => resp.text())
    .catch((error) => {
      console.error(error)
      throw new Error("Failed to download file from Google Drive")
    })

export const getDriveFileAppProperties = (
  fileId: string,
  accessToken: string
): Promise<{
  appProperties: {
    isGuildWallet: string
    backupData: string
    address: string
    createdAt: string
  }
}> =>
  fetcher(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=appProperties`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then((result) => {
      if (!result?.appProperties?.backupData) {
        throw new Error("backupData app property not found")
      }
      return result
    })
    .catch((error) => {
      console.error(error)
      throw new DriveRequestFailed(error)
    })
