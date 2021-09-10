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
            address: "",
            method: "balanceOf",
            value: 500,
          },
        ],
      },
    ],
    members: 128,
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
            address: "",
            method: "balanceOf",
            value: 1000,
          },
        ],
      },
    ],
    members: 362,
  },
]

export default guilds
