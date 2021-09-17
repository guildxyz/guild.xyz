import guildsJSON from "temporaryData/guilds"

const DEBUG = false

const fetchGuilds = () =>
  DEBUG && process.env.NODE_ENV !== "production"
    ? guildsJSON
    : fetch(`${process.env.NEXT_PUBLIC_API}/community/guilds/all`).then((response) =>
        response.ok ? response.json() : []
      )

export default fetchGuilds
