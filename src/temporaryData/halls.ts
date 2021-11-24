import { Hall } from "./types"

const halls: Array<Hall> = [
  {
    id: 1,
    name: "My first hall",
    urlName: "my-first-hall",
    guilds: [],
    members: [],
    owner: {
      id: 1,
      addresses: ["0x9450fE40322A1269e6db6BE4AB5CCF5d4D93761c"],
    },
  },
  {
    id: 2,
    name: "Guildhall's hall",
    urlName: "guildhalls-hall",
    guilds: [],
    members: ["0x2893b7e6E8a5aF81d262024a550a3159b1F65217"],
    owner: {
      id: 2,
      addresses: [""],
    },
  },
]

export default halls
