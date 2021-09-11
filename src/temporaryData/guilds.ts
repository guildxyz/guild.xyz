import { Guild } from "./types"

const guilds: Guild[] = [
  {
    id: 1,
    name: "My first test guild",
    urlName: "my-first-test-guild",
    levels: [
      {
        id: 0,
        requirements: [
          {
            type: "TOKEN",
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            method: "balanceOf",
            value: 500,
          },
        ],
      },
    ],
    members: 128,
    communityPlatforms: [{ name: "TELEGRAM", platformId: null, active: true }],
  },
  {
    id: 2,
    name: "WAGMI Guild",
    urlName: "wagmi-guild",
    levels: [
      {
        id: 0,
        requirements: [
          {
            type: "NFT",
            address: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
            method: "getAccessory",
            data: "accessory",
            value: "Lucurious Band",
          },
          {
            type: "POAP",
            value: "ETHCC[4]",
          },
          {
            type: "TOKEN",
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            method: "balanceOf",
            value: 1000,
          },
        ],
      },
    ],
    members: 362,
    communityPlatforms: [
      { name: "DISCORD", platformId: "842030939332804679", active: true },
    ],
  },
]

export default guilds
