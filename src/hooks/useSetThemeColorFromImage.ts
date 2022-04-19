import Color from "color"
import ColorThief from "colorthief/dist/color-thief.mjs"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

const useSetThemeColorFromImage = () => {
  const { control, setValue } = useFormContext()

  const imageUrl = useWatch({ control, name: "imageUrl" })

  useEffect(() => {
    if (!setValue || !imageUrl || imageUrl.includes("guildLogos")) return

    const colorThief = new ColorThief()

    const imgEl = document.createElement("img")
    imgEl.src = imageUrl
    imgEl.width = 64
    imgEl.height = 64
    imgEl.crossOrigin = "anonymous"

    imgEl.addEventListener("load", () => {
      const dominantRgbColor = colorThief.getColor(imgEl)
      const dominantHexColor = Color.rgb(dominantRgbColor).hex()
      setValue("theme.color", dominantHexColor)
    })
  }, [setValue, imageUrl])
}

export default useSetThemeColorFromImage
