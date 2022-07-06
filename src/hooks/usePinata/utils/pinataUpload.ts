export type PinataPinFileResponse = {
  IpfsHash: string
  PinSize: number
  Timestamp: string
  isDuplicate?: boolean
}

export type PinToIPFSProps = {
  jwt?: string
  data: (File | string)[]
  fileNames?: string[]
  pinataOptions?: {
    cidVersion?: "0" | "1"
    wrapWithDirectory?: boolean
    customPinPolicy?: {
      regions: Array<{ id: "FRA1" | "NYC1"; desiredReplicationCount: 0 | 1 | 2 }>
    }
  }
  pinataMetadata?: {
    name?: string
    keyvalues?: Record<string, string | number | Date>
  }
  onProgress?: (progress: number) => void
}

const pinFileToIPFS = ({
  data,
  fileNames = [""],
  pinataOptions = {},
  pinataMetadata = {},
  jwt,
  onProgress,
}: PinToIPFSProps) =>
  new Promise<PinataPinFileResponse>(async (resolve, reject) => {
    const apiKey =
      jwt?.length > 0
        ? { jwt, key: undefined }
        : await fetch("/api/pinata-key").then((response) =>
            response.json().then((body) => ({ jwt: body.jwt, key: body.key }))
          )

    const formData = new FormData()

    if (data.length <= 0)
      reject(
        "This shouldn't happen. Tried to upload 0 images, please contact us on Discord"
      )
    if (data.length !== fileNames.length)
      reject(
        "This shouldn't happen. Wrong number of images passed, please contact us on Discord"
      )
    data.forEach((d, index) => {
      if (typeof d === "string") {
        const blob = new Blob([d])
        formData.append("file", blob, fileNames[index])
      } else {
        formData.append("file", d)
      }
    })

    if (Object.keys(pinataOptions).length > 0) {
      formData.append("pinataOptions", JSON.stringify(pinataOptions))
    }

    if (Object.keys(pinataMetadata).length > 0) {
      formData.append("pinataMetadata", JSON.stringify(pinataMetadata))
    }

    const xhr = new XMLHttpRequest()
    xhr.open("POST", "https://api.pinata.cloud/pinning/pinFileToIPFS")
    xhr.setRequestHeader("Authorization", `Bearer ${apiKey.jwt}`)

    xhr.upload.onprogress = (event) =>
      onProgress?.((event.loaded / event.total) * 0.9)
    xhr.onload = async () => {
      if (!jwt)
        await fetch("/api/pinata-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: apiKey.key }),
        }).catch(() => console.error("Failed to revoke API key after request"))

      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(1)
        resolve(JSON.parse(xhr.response))
      } else {
        onProgress?.(0)
        if (xhr.status === 401) reject("Invalid authorization")
        else reject("Upload request failed")
      }
    }
    xhr.onerror = () => reject("Failed to upload image to Pinata")

    xhr.onabort = () => reject("Failed to upload image to Pinata")

    xhr.send(formData as any)
  })

export default pinFileToIPFS
