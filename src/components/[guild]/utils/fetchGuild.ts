import { Guild } from "temporaryData/types"

export const fetchGuild = (urlName: string): Promise<Guild> =>
  fetch(`${process.env.NEXT_PUBLIC_API}/guild/urlName/${urlName}`).then((response) =>
    response.ok ? response.json() : undefined
  )
