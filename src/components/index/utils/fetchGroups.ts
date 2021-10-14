import guildsJSON from "temporaryData/guilds"

const DEBUG = false

const fetchGroups = () =>
  DEBUG && process.env.NODE_ENV !== "production"
    ? guildsJSON
    : fetch(`${process.env.NEXT_PUBLIC_API}/group`).then((response) =>
        response.ok ? response.json() : []
      )

export default fetchGroups
