import Color from "color"
import ColorThief from "colorthief/dist/color-thief.mjs"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import pinataUpload from "utils/pinataUpload"

const useSetImageAndNameFromPlatformData = (
  platformImage: string,
  platformName: string,
  setUploadPromise: Dispatch<SetStateAction<Promise<void>>>
) => {
  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  useEffect(() => {
    if (!(platformName?.length > 0) || !!touchedFields.name) return

    setValue("name", platformName)
  }, [platformName])

  useEffect(() => {
    if (!(platformImage?.length > 0) || !!touchedFields.imageUrl) {
      setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
      return
    }

    setValue("imageUrl", platformImage)
    ;(async () => setValue("theme.color", await getColorByImage(platformImage)))()

    setUploadPromise(
      fetch(platformImage)
        .then((response) => response.blob())
        .then((blob) =>
          pinataUpload({
            data: [new File([blob], `${platformName}.png`, { type: "image/png" })],
          })
            .then(({ IpfsHash }) => {
              setValue(
                "imageUrl",
                `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
              )
            })
            .catch(() => {
              setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
            })
        )
    )
  }, [platformImage])
}

const getColorByImage = (imageUrl) =>
  new Promise((resolve, reject) => {
    const colorThief = new ColorThief()

    const imgEl = document.createElement("img")
    imgEl.src = imageUrl
    imgEl.width = 64
    imgEl.height = 64
    imgEl.crossOrigin = "anonymous"

    imgEl.addEventListener("load", () => {
      const dominantRgbColor = colorThief.getColor(imgEl)
      const dominantHexColor = Color.rgb(dominantRgbColor).hex()
      resolve(dominantHexColor)
    })
  })

export default useSetImageAndNameFromPlatformData
