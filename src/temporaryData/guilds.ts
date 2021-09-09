import { Guild } from "./types"

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

export default guilds
