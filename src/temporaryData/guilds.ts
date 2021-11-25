import { Guild } from "./types"

const guilds: Guild[] = [
  {
    id: 1,
    name: "My first test guild",
    urlName: "my-first-test-guild",
    requirements: [
      {
        type: "ERC20",
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        method: "balanceOf",
        value: "500",
      },
    ],
    members: [],
    guildPlatforms: [
      { name: "TELEGRAM", platformId: null, serverName: "TG Group Name" },
    ],
    owner: {
      id: 0,
      addresses: ["0x9450fE40322A1269e6db6BE4AB5CCF5d4D93761c"],
    },
    themeColor: "#000000",
    themeMode: "LIGHT",
  },
  {
    id: 2,
    name: "WAGMI Guild",
    urlName: "wagmi-guild",
    requirements: [
      {
        type: "ERC20",
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        method: "balanceOf",
        value: "1000",
      },
    ],
    members: [],
    guildPlatforms: [
      {
        name: "DISCORD",
        platformId: "842030939332804679",
        serverName: "DC Server Name",
      },
    ],
    owner: {
      id: 0,
      addresses: ["0x9450fE40322A1269e6db6BE4AB5CCF5d4D93761c"],
    },
    themeColor: "#000000",
  },
]

export default guilds
