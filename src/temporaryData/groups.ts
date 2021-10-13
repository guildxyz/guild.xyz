import guilds from "./guilds"
import { Group } from "./types"

const groups: Array<Group> = [
  {
    id: 1,
    name: "My first group",
    urlName: "my-first-group",
    guilds: guilds.filter((guild) => guild.id === 2),
  },
  {
    id: 2,
    name: "Guildhall's group",
    urlName: "guildhalls-group",
    guilds: guilds,
  },
]

export default groups
