// TODO, these are just temporary types

type Guild = {
  id: number
  name: string
  urlName: string
  requirements: Requirement[]
  members: number
}

type Requirement = {
  holdType: "NFT" | "POAP" | "TOKEN"
  nft?: string
  poap?: string
  token?: string
  tokenQuantity?: number
}

enum HoldTypeColors {
  NFT = "#4ade80",
  POAP = "#60a5fa",
  TOKEN = "#818CF8",
}

const guilds: Guild[] = [
  {
    id: 1,
    name: "My first test guild",
    urlName: "my-first-test-guild",
    requirements: [
      {
        holdType: "TOKEN",
        token: "AGLD",
        tokenQuantity: 500,
      },
    ],
    members: 128,
  },
  {
    id: 2,
    name: "WAGMI Guild",
    urlName: "wagmi-guild",
    requirements: [
      {
        holdType: "NFT",
        nft: "CryptoPunk with Lucurious Band",
      },
      {
        holdType: "POAP",
        poap: "ETHCC[4]",
      },
      {
        holdType: "TOKEN",
        token: "AGLD",
        tokenQuantity: 1000,
      },
    ],
    members: 362,
  },
]

export type { Guild, Requirement }
export { HoldTypeColors, guilds }
