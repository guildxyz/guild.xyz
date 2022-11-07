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

    const members: string[] = [
      ...new Set(
        guild.roles
          .map((role) => role.members)
          ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
          ?.filter((member) => typeof member === "string") || []
      ),
    ]

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "320px",
              height: "450px",
              opacity: 0.6,
            }}
            src={`${baseUrl}/img/guilders${isLightMode ? "-dark" : ""}.svg`}
            alt="Guilders"
          />

          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "transparent",
              backgroundImage: isLightMode
                ? "linear-gradient(to right, rgba(244, 244, 245, 1) 0%, rgba(244, 244, 245, 1) 55%, rgba(244, 244, 245, 0) 85%, rgba(244, 244, 245, 0))"
                : "linear-gradient(to right, rgba(39, 39, 42, 1) 0%, rgba(39, 39, 42, 1) 55%, rgba(39, 39, 42, 0) 85%, rgba(39, 39, 42, 0))",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              paddingTop: "56px",
              paddingLeft: "56px",
              width: "480px",
              height: "386px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "4px",
                  marginRight: "16px",
                  width: "48px",
                  height: "48px",
                  backgroundColor: isLightMode ? "#3f3f46" : "#52525b",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  style={{
                    width: guild.imageUrl?.match("guildLogos") ? "20px" : "48px",
                    height: guild.imageUrl?.match("guildLogos") ? "20px" : "48px",
                    borderRadius: guild.imageUrl?.match("guildLogos") ? 0 : "50%",
                  }}
                  src={
                    guild.imageUrl?.startsWith("http")
                      ? `${baseUrl}/_next/image?url=${guild.imageUrl}&w=48&q=75`
                      : `${baseUrl}${guild.imageUrl}`
                  }
                  alt={guild.name}
                />
              </div>
              <h1
                style={{
                  width: "356px",
                  fontFamily: "Dystopian, sans-serif",
                  fontSize: "48px",
                  color: isLightMode ? "#27272A" : "white",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {guild.name}
              </h1>
            </div>

            <div style={{ display: "flex", marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "12px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  height: "32px",
                  backgroundColor: isLightMode ? "#d4d4d8" : "#52525b",
                  color: isLightMode ? "#27272A" : "white",
                  fontWeight: "bold",
                  borderRadius: "6px",
                  fontSize: "18px",
                }}
              >{`${members?.length || 0} members`}</div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  height: "32px",
                  backgroundColor: isLightMode ? "#d4d4d8" : "#52525b",
                  color: isLightMode ? "#27272A" : "white",
                  fontWeight: "bold",
                  borderRadius: "6px",
                  fontSize: "18px",
                }}
              >{`${roles?.length || 0} roles`}</div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "388px",
                fontFamily: "Dystopian, sans-serif",
                fontSize: "24px",
                fontWeight: "bold",
                color: isLightMode ? "#27272A" : "white",
              }}
            >
              {guild.description ? (
                `${safeGuildDescription?.slice(0, 80)}${
                  safeGuildDescription?.length > 80 ? "..." : ""
                }`
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ marginBottom: "4px" }}>
                    {"That's a great party in there!"}
                  </div>
                  <div>{"I dare you to be the plus one."}</div>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "auto",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                style={{
                  marginTop: "4px",
                  marginRight: "8px",
                  width: "20px",
                  height: "20px",
                }}
                src={`${baseUrl}/guildLogos/logo${isLightMode ? "-dark" : ""}.svg`}
                alt="Guild.xyz"
              />
              <div
                style={{
                  fontFamily: "Dystopian, sans-serif",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: isLightMode ? "#27272A" : "white",
                  lineHeight: 1.2,
                }}
              >
                Guild.xyz
              </div>
            </div>
          </div>
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
