import { Group } from "./types"

const groups: Array<Group> = [
  {
    id: 1,
    name: "My first group",
    urlName: "my-first-group",
    guilds: [],
    members: [],
    owner: {
      id: 1,
      addresses: ["0x9450fE40322A1269e6db6BE4AB5CCF5d4D93761c"],
    },
  },
  {
    id: 2,
    name: "Guildhall's group",
    urlName: "guildhalls-group",
    guilds: [],
    members: ["0x2893b7e6E8a5aF81d262024a550a3159b1F65217"],
    owner: {
      id: 2,
      addresses: [""],
    },
  },
]

export default groups
