import guilds from "./guilds"
import { Group } from "./types"

const groups: Array<Group> = [
  {
    id: 1,
    name: "My first group",
    urlName: "my-first-group",
    guilds: guilds.filter(
      (guild) => guild.urlName === "johnnytest" || guild.urlName === "deep-space-dao"
    ),
  },
  {
    id: 2,
    name: "Guildhall's group",
    urlName: "guildhalls-group",
    guilds: guilds.filter(
      (guild) => guild.urlName === "eth-hold" || guild.urlName === "rekolony"
    ),
  },
]

export default groups
