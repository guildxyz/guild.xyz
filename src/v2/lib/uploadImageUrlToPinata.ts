import { Uploader } from "hooks/usePinata/usePinata"

export const uploadImageUrlToPinata = async ({
  image,
  onUpload,
}: { image: URL; onUpload: Uploader["onUpload"] }) => {
  const data = await (await fetch(image)).blob()
  const fileName = image.pathname.split("/").at(-1) || "unknown"
  onUpload({
    data: [new File([data], fileName)],
    fileNames: [fileName],
  })
}
