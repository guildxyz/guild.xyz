type PinataPinFileResponse = {
  IpfsHash: string
  PinSize: number
  Timestamp: string
  isDuplicate?: boolean
}

const pinataUpload = (file: File, onProgress?: (progress: number) => void) =>
  new Promise<PinataPinFileResponse>(async (resolve, reject) => {
    const jwtResponse = await fetch("/api/pinata-key")
    const { jwt, key } = await jwtResponse.json()

    const formData = new FormData()
    formData.append("file", file)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", "https://api.pinata.cloud/pinning/pinFileToIPFS")
    xhr.setRequestHeader("Authorization", `Bearer ${jwt}`)

    xhr.upload.onprogress = (event) =>
      onProgress?.((event.loaded / event.total) * 0.9)
    xhr.onload = async () => {
      await fetch("/api/pinata-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      }).catch(() => console.error("Failed to revoke API key after request"))

      onProgress?.(1)
      resolve(JSON.parse(xhr.response))
    }
    xhr.onerror = () => reject(new Error("Failed to upload image to Pinata"))

    xhr.send(formData)
  })

export default pinataUpload
