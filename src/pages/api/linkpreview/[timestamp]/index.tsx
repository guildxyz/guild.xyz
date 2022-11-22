import { ImageResponse } from "@vercel/og"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

export const config = {
  runtime: "experimental-edge",
  unstable_allowDynamic: [
    "/src/hooks/useLocalStorage.ts",
    "/src/hooks/useTimeInaccuracy.ts",
    "/src/utils/fetcher.ts",
    "/src/hooks/useSubmit/useSubmit.ts",
    "/src/hooks/useKeyPair.ts",
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

  try {
    const [guilds, interFontData, interBoldFontData, dystopianFontData] =
      await Promise.all([
        fetcher(`/guild?order=members`).catch((_) => []),
        interFont,
        interBoldFont,
        dystopianFont,
      ])

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            position: "relative",
            backgroundColor: "#27272a",
            width: "800px",
            height: "450px",
            fontFamily: "Inter var, Inter, sans-serif",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              position: "absolute",
              top: 0,
              right: "-64px",
              paddingTop: "20px",
              width: "400px",
              transform: "scale(1.5)",
              transformOrigin: "top",
            }}
          >
            {guilds?.slice(0, 8).map((guild) => (
              <GuildCard key={guild.urlName} guild={guild} baseUrl={baseUrl} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "transparent",
              backgroundImage:
                "linear-gradient(to right, rgba(39, 39, 42, 1) 0%, rgba(39, 39, 42, 1) 45%, rgba(39, 39, 42, 0) 65%, rgba(39, 39, 42, 0))",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              paddingTop: "56px",
              paddingLeft: "56px",
              width: "400px",
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                style={{
                  width: "40px",
                  height: "40px",
                  marginTop: "4px",
                  marginRight: "16px",
                }}
                src={`${baseUrl}/guildLogos/logo.svg`}
                alt="Guild.xyz"
              />
              <h1
                style={{
                  fontFamily: "Dystopian, sans-serif",
                  fontSize: "48px",
                  color: "white",
                }}
              >
                Guild
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "16px",
                paddingRight: "16px",
                height: "32px",
                backgroundColor: "#52525b",
                color: "white",
                fontWeight: "bold",
                borderRadius: "6px",
                fontSize: "18px",
              }}
            >{`${guilds?.length || 0} guilds`}</div>

            <div
              style={{
                marginTop: "auto",
                fontFamily: "Dystopian, sans-serif",
                fontSize: "24px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.2,
              }}
            >
              Manage roles
            </div>
            <div
              style={{
                fontFamily: "Dystopian, sans-serif",
                fontSize: "24px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.2,
              }}
            >
              in your community
            </div>
            <div
              style={{
                fontFamily: "Dystopian, sans-serif",
                fontSize: "24px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.2,
              }}
            >
              based on tokens &amp; NFTs
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
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}

type GuildCardProps = {
  guild: GuildBase
  baseUrl: string
}

const GuildCard = ({ guild, baseUrl }: GuildCardProps): JSX.Element => (
  <div
    style={{
      width: "150px",
      marginRight: "12px",
      marginBottom: "12px",
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      paddingLeft: "12px",
      paddingRight: "12px",
      paddingTop: "14px",
      paddingBottom: "14px",
      backgroundColor: "#3f3f46",
      borderRadius: "8px",
      boxShadow:
        "0 2px 3px -0.5px rgba(0, 0, 0, 0.1),0 1px 2px -0.5px rgba(0, 0, 0, 0.06)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "8px",
        width: "24px",
        height: "24px",
        backgroundColor: "#52525b",
        borderRadius: "50%",
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        style={{
          width: guild.imageUrl?.match("guildLogos") ? "10px" : "24px",
          height: guild.imageUrl?.match("guildLogos") ? "10px" : "24px",
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          margin: 0,
          width: "92px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontFamily: "Dystopian, sans-serif",
          fontSize: "10px",
          fontWeight: "black",
          letterSpacing: "0.5px",
          color: "white",
        }}
      >
        {guild.name}
      </h2>

      <div
        style={{
          display: "flex",
          marginTop: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "4px",
            paddingLeft: "4px",
            paddingRight: "4px",
            height: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "white",
            borderRadius: "3px",
            fontSize: "7px",
          }}
        >
          <span>{guild.memberCount}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: "4px",
            paddingRight: "4px",
            height: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "white",
            borderRadius: "3px",
            fontSize: "7px",
          }}
        >
          <span>{`${guild.roles.length} roles`}</span>
        </div>
      </div>
    </div>
  </div>
)

export default handler
