import fetcher from "utils/fetcher"

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
