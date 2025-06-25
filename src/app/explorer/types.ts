export enum ActiveSection {
  YourGuilds = "your-guilds",
  ExploreGuilds = "explore-guilds",
}

export interface AlphaGuild {
  id: string
  name: string
  urlName: string
  logoUrl?: string
  memberCount: number
  isVerified?: boolean
}
