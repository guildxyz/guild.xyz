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
            value: "500",
          },
        ],
        members: [],
      },
    ],
    communityPlatforms: [{ name: "TELEGRAM", platformId: null, active: true }],
    owner: {
      id: 0,
      addresses: [{ address: "0x9450fE40322A1269e6db6BE4AB5CCF5d4D93761c" }],
    },
    themeColor: "#000000",
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
            type: "LOOT",
            data: "accessory",
            value: "Lucurious Band",
          },
          {
            type: "LOOT",
            value: "",
          },
          {
            type: "TOKEN",
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            method: "balanceOf",
            value: "1000",
          },
        ],
        members: [],
      },
    ],
    communityPlatforms: [
      { name: "DISCORD", platformId: "842030939332804679", active: true },
    ],
    owner: {
      id: 0,
      addresses: [{ address: "0x9450fE40322A1269e6db6BE4AB5CCF5d4D93761c" }],
    },
    themeColor: "#000000",
  },
]

export default guilds
