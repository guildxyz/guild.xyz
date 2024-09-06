import { Uploader } from "hooks/usePinata/usePinata"

export const uploadImageUrlAvatarToPinata = async ({
  image,
  uploader,
}: { image: URL; uploader: Uploader }) => {
  const data = await (await fetch(image)).blob()
  const fileName = image.pathname.split("/").at(-1) || "unknown"
  uploader.onUpload({
    data: [new File([data], fileName)],
    fileNames: [fileName],
  })
}
