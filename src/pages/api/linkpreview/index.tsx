import { ImageResponse } from "@vercel/og"
import { GuildBase } from "types"

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
    // const guilds = await fetcher(`/guild?order=members`).catch((_) => [])

    const guilds: GuildBase[] = [
      {
        id: 9839,
        name: "Arbitrum",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmWgXnAcLXhXfRL4u4jcmpXNXXbLXSt3WvmETeaLjBgS5S",
        urlName: "arbitrum",
        roles: [
          "Arbinaut 🚀",
          "Arbisquad",
          "Brinc fam 🔹",
          "Dopex fam 💎",
          "GMX fam 🫐",
          "Galleon fam 🏴‍☠️",
          "HOP fam 🐇",
          "JonesDAO fam 🐂",
          "LINK marine 🔗",
          "Livepeer fam ▶️",
          "Mycelium fam ✖️",
          "PlutusDAO fam 🕳️",
          "Sperax fam 🧩",
          "Synapse fam 🟣",
          "Treasure fam ✨",
          "Umami fam 🍔",
          "Vesta fam 🤍",
        ],
        platforms: ["DISCORD"],
        memberCount: 70681,
      },
      {
        id: 8212,
        name: "SyncSwap Guild",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmbBY85pZnGNXRaKRpf5SqNNA971cGVRdrLJirYck6yaPx",
        urlName: "syncswap",
        roles: [
          "Distro Collector",
          "Guild Member",
          "Proud Partner OAT Holder",
          "Testnet Badge Holder",
          "Testnet Voter",
          "Twitter Fren",
        ],
        platforms: ["DISCORD"],
        memberCount: 56366,
      },
      {
        id: 3474,
        name: "AxelarSea",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmUuVD8jSXY4vLQnxyMSAMjUX4FKakSKGZrj92q3yuqWQC",
        urlName: "axelarsea",
        roles: [
          "NFT Bridge Tester",
          "Testnet V1 Tester",
          "Wallet verified",
          "twitter verified",
        ],
        platforms: ["DISCORD"],
        memberCount: 39520,
      },
      {
        id: 7326,
        name: "Galxe",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmXzePDa6MoJKQxbDbrAhFFBgp3UhM5MeK613cAiL7uD8E",
        urlName: "galxe",

        roles: ["Member"],
        platforms: ["DISCORD"],
        memberCount: 31228,
      },
      {
        id: 3619,
        name: "Increment",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmTDtbzdx11SvyqVoSmnDxaowCeXucanMFQvw731Qbqs7w",
        urlName: "increment",
        roles: ["Beta v1 Tester", "Beta v2 Tester"],
        platforms: ["DISCORD"],
        memberCount: 26640,
      },
      {
        id: 1985,
        name: "Our Guild",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmSJtjpHzaEdMuBE2uAPSN3r32eZkLXndMzQLBSbknFD1W",
        urlName: "our-guild",

        roles: [
          "Early Tester Badge Holder",
          "Guild Alpha",
          "Guild Grower",
          "Guild Maxi",
          "Guild Member",
          "Guild Members",
          "Guild NFT Holder",
          "Our Guild is evolving",
        ],
        platforms: ["DISCORD", "GITHUB", "GOOGLE", "TELEGRAM"],
        memberCount: 20617,
      },
      {
        id: 10762,
        name: "Swapped Finance",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmWdknKNRRkASmVadCMTgRvsvY21ENaFvALNJNi4cK2NtU",
        urlName: "swappedfinance",

        roles: ["101 Master", "Guild Member", "TwitterSquad"],
        platforms: ["DISCORD"],
        memberCount: 18735,
      },
      {
        id: 9267,
        name: "Layer3",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmQLA3ydd2Hf6WrPEF2CrYfckdLq8uVpidmtHGRwoCLisH",
        urlName: "layer3",

        roles: ["Guild Member", "Guild Supporter"],
        platforms: ["DISCORD"],
        memberCount: 18474,
      },
      {
        id: 11886,
        name: "Orbiter Finance",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmSJZC3auCphTxLpm5weiUsHyeAKXjaxAuXUFToWhg5DRU",
        urlName: "orbiter-finance",

        roles: [
          "Ace Pilot",
          "Elite Pilot",
          "Expert Pilot",
          "Flying Alien",
          "Member",
          "Pilot",
          "Trainee Pilot",
        ],
        platforms: ["DISCORD"],
        memberCount: 18108,
      },
      {
        id: 10457,
        name: "Mint Square",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmNTfpCTbgpT2eZddtxFYoW1kTongnmuw2kzRRdPnoyZUg",
        urlName: "mintsquare",

        roles: ["Guild Member", "Test & Earn Badge"],
        platforms: ["DISCORD"],
        memberCount: 16079,
      },
      {
        id: 7301,
        name: "SealCred.xyz",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmYUXxamuBa5Vd31oseqTpTUkN6W4GVHj679oC7nexaMjG",
        urlName: "sealcred",

        roles: [
          "@126.com owner (v0.2-goerli)",
          "@139.com owner (v0.2-goerli)",
          "@163.com owner (v0.2-goerli)",
          "@allcmail.com owner (v0.2-goerli)",
          "@foxmail.com owner (v0.2-goerli)",
          "@gmail.com owner (v0.2-goerli)",
          "@hotmail.com owner (v0.2-goerli)",
          "@list.ru owner (v0.2-goerli)",
          "@mail.ru owner (v0.2-goerli)",
          "@naver.com owner (v0.2-goerli)",
          "@outlook.com owner (v0.2-goerli)",
          "@proton.me owner (v0.2-goerli)",
          "@protonmail.com owner (v0.2-goerli)",
          "@qq.com owner (v0.2-goerli)",
          "@rambler.ru owner (v0.2-goerli)",
          "@rambler.ua owner (v0.2-goerli)",
          "@sina.com owner (v0.2-goerli)",
          "@skiff.com owner (v0.2-goerli)",
          "@ujinjx.cn owner (v0.2-goerli)",
          "@vip.qq.com owner (v0.2-goerli)",
          "@yahoo.com owner (v0.2-goerli)",
          "@yeah.net owner (v0.2-goerli)",
          "@zdee.cc owner (v0.2-goerli)",
          "AppleFrens owner (v0.2-goerli)",
          "AppleFrens owner (v0.2.4-goerli)",
          "BananaFrens owner (v0.2-goerli)",
          "BananaFrens owner (v0.2.4-goerli)",
          "CherryFrens owner (v0.2-goerli)",
          "CherryFrens owner (v0.2.4-goerli)",
          "Fake ERC721 owner (v0.2-goerli)",
          "Fake Loot owner (v0.2-goerli)",
          "GrapeFrens owner (v0.2-goerli)",
          "GrapeFrens owner (v0.2.4-goerli)",
          "Influence Asteroids owner (v0.2-goerli)",
          "Influence Crew owner (v0.2-goerli)",
          "MultiFaucet NFT owner (v0.2-goerli)",
          "MultiFaucet NFT owner (v0.2.4-goerli)",
          "OrangeFrens owner (v0.2-goerli)",
          "OrangeFrens owner (v0.2.4-goerli)",
          "PearFrens owner (v0.2-goerli)",
          "PearFrens owner (v0.2.4-goerli)",
          "PoLido owner (v0.2-goerli)",
          "StrawberryFrens owner (v0.2-goerli)",
          "StrawberryFrens owner (v0.2.4-goerli)",
          "Uniswap V3 Positions NFT-V1 owner (v0.2-goerli)",
          "Verified Holder",
          "Zora API Genesis Hackathon owner (v0.2.4-mainnet)",
          "test owner (v0.2-goerli)",
        ],
        platforms: ["DISCORD"],
        memberCount: 12539,
      },
      {
        id: 2893,
        name: "CyberConnect",
        imageUrl:
          "https://guild-xyz.mypinata.cloud/ipfs/QmVpg6vf8666CEjKXRa3wqhAKTPsC4nGedpDcWzw32yU86",
        urlName: "cyberconnect",

        roles: ["Member"],
        platforms: ["DISCORD"],
        memberCount: 12443,
      },
    ]

    const interFontData = await interFont
    const interBoldFontData = await interBoldFont
    const dystopianFontData = await dystopianFont

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
              right: "-80px",
              paddingTop: "20px",
              width: "800px",
              opacity: 0.6,
              transform: "scale(1.25)",
              transformOrigin: "top",
            }}
          >
            {guilds?.slice(0, 12).map((guild) => (
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
        debug: true,
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
      width: "45%",
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
          width: "248px",
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
