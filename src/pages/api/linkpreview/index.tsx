import { ImageResponse } from "@vercel/og"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

export const config = {
  runtime: "experimental-edge",
}

const interFont = fetch(
  new URL("../../../../public/fonts/Inter-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer())
const interBoldFont = fetch(
  new URL("../../../../public/fonts/Inter-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer())
const dystopianFont = fetch(
  new URL("../../../../public/fonts/Dystopian-Black.ttf", import.meta.url)
).then((res) => res.arrayBuffer())

const handler = async () => {
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
            width: "100%",
            height: "100vh",
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
              right: "-128px",
              paddingTop: "40px",
              width: "800px",
              opacity: 0.6,
              transform: "scale(1.5)",
              transformOrigin: "top",
            }}
          >
            {guilds?.slice(0, 8).map((guild) => (
              <GuildCard key={guild.urlName} guild={guild} />
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
              paddingTop: "112px",
              paddingLeft: "112px",
              width: "800px",
              height: "772px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "48px",
                width: "100%",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                style={{
                  width: "80px",
                  height: "80px",
                  marginTop: "8px",
                  marginRight: "32px",
                }}
                src="https://guild.xyz/guildLogos/logo.svg"
                alt="Guild.xyz"
              />
              <h1
                style={{
                  fontFamily: "Dystopian, sans-serif",
                  fontSize: "96px",
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
                paddingLeft: "32px",
                paddingRight: "32px",
                height: "64px",
                backgroundColor: "#52525b",
                color: "white",
                fontWeight: "bold",
                borderRadius: "12px",
                fontSize: "36px",
              }}
            >{`${guilds?.length || 0} guilds`}</div>

            <div
              style={{
                marginTop: "auto",
                fontFamily: "Dystopian, sans-serif",
                fontSize: "48px",
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
                fontSize: "48px",
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
                fontSize: "48px",
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
        width: 1600,
        height: 900,
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
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}

type GuildCardProps = {
  guild: GuildBase
}

const GuildCard = ({ guild }: GuildCardProps): JSX.Element => (
  <div
    style={{
      width: "300px",
      marginRight: "24px",
      marginBottom: "24px",
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      paddingLeft: "24px",
      paddingRight: "24px",
      paddingTop: "28px",
      paddingBottom: "28px",
      backgroundColor: "#3f3f46",
      borderRadius: "16px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "16px",
        width: "48px",
        height: "48px",
        backgroundColor: "#52525b",
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
            ? guild.imageUrl
            : `https://guild.xyz${guild.imageUrl}`
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
          width: "184px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontFamily: "Dystopian, sans-serif",
          fontSize: "20px",
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
          marginTop: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "8px",
            paddingLeft: "8px",
            paddingRight: "8px",
            height: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "white",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16px"
            height="16px"
            fill="rgba(255, 255, 255, 0.8)"
            viewBox="0 0 256 256"
            focusable="false"
            style={{
              marginRight: "8px",
            }}
          >
            <rect width="256" height="256" fill="none" />
            <circle
              cx="88"
              cy="108"
              r="52"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            />
            <path
              d="M155.4,57.9A54.5,54.5,0,0,1,169.5,56a52,52,0,0,1,0,104"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            />
            <path
              d="M16,197.4a88,88,0,0,1,144,0"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            />
            <path
              d="M169.5,160a87.9,87.9,0,0,1,72,37.4"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="24"
            />
          </svg>
          <span>{guild.memberCount}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: "8px",
            paddingRight: "8px",
            height: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "white",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          <span>{`${guild.roles.length} roles`}</span>
        </div>
      </div>
    </div>
  </div>
)

export default handler
