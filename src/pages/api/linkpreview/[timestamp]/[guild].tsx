import { ImageResponse } from "@vercel/og"
import { Guild } from "types"
import fetcher from "utils/fetcher"

export const config = {
  runtime: "experimental-edge",
  unstable_allowDynamic: [
    "/src/hooks/useLocalStorage.ts",
    "/src/hooks/useTimeInaccuracy.ts",
    "/src/utils/fetcher.ts",
  ],
}

const interFont = fetch(
  new URL("../../../../../public/fonts/Inter-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer())
const interBoldFont = fetch(
  new URL("../../../../../public/fonts/Inter-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer())
const dystopianFont = fetch(
  new URL("../../../../../public/fonts/Dystopian-Black.ttf", import.meta.url)
).then((res) => res.arrayBuffer())

const handler = async (req, _) => {
  const { protocol, host } = req.nextUrl
  const baseUrl = `${protocol}//${host}`

  const [, urlName] =
    req.nextUrl?.pathname
      ?.replace("/api/linkpreview", "")
      ?.split("/")
      ?.filter((param) => !!param) ?? []

  if (!urlName) return new ImageResponse(<></>, { status: 404 })

  const guild: Guild = await fetcher(`/guild/${urlName}`)

  if (!guild?.id) return new ImageResponse(<></>, { status: 404 })

  try {
    const [interFontData, interBoldFontData, dystopianFontData] = await Promise.all([
      interFont,
      interBoldFont,
      dystopianFont,
    ])

    const roles = guild.roles?.map((role) => role.name)

    const safeGuildDescription = guild.description?.replaceAll("\n", "")
    const isLightMode = guild.theme?.mode === "LIGHT"

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            position: "relative",
            backgroundColor: isLightMode ? "#f4f4f5" : "#27272a",
            width: "800px",
            height: "450px",
            fontFamily: "Inter var, Inter, sans-serif",
            overflow: "hidden",
          }}
        >
          test
        </div>
      ),
      {
        width: 800,
        height: 450,
        fonts: [
          {
            name: "Inter",
            data: interFontData,
            style: "normal",
            weight: 400,
          },
          {
            name: "Inter",
            data: interBoldFontData,
            style: "normal",
            weight: 700,
          },
          {
            name: "Dystopian",
            data: dystopianFontData,
            style: "normal",
          },
        ],
      }
    )
  } catch (e: any) {}
}

export default handler
