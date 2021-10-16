type Logic = "AND" | "OR" | "NOR" | "NAND"

type CoingeckoToken = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

type Poap = {
  id: number
  fancy_id: string
  name: string
  event_url?: string
  image_url: string
  country?: string
  city?: string
  description?: string
  year: number
  start_date: string
  end_date: string
  expiry_date: string
  from_admin: boolean
  virtual_event: boolean
  event_template_id: number
  event_host_id: number
}

type NFT = {
  name: string
  type: string
  address: string
  logoUri: string
  slug: string
}

type RequirementType =
  | "ETHER"
  | "ERC20"
  | "ERC721"
  | "POAP"
  | "SNAPSHOT"
  | "WHITELIST"

type Requirement = {
  type: RequirementType
  address?: string
  symbol?: string
  method?: string
  key?: string
  value: string | Record<string, string | number> | Array<string>
  name?: string
}

type Level = {
  id: number
  requirements: Array<Requirement>
  membersCount?: number
  members: Array<string>
  telegramGroupId?: string
  discordRole?: string
  logic?: Logic
}

type PlatformName = "TELEGRAM" | "DISCORD"

type Platform = {
  name: PlatformName
  platformId: string
  data?: {
    inviteChannel?: string
  }
}

type User = {
  address: string
}

type Guild = {
  id: number
  name: string
  urlName: string
  imageUrl?: string
  description?: string
  owner?: {
    id: number
    addresses: Array<string>
  }
  guildPlatforms: Array<Platform>
  themeColor: string
  themeMode?: "DARK" | "LIGHT"
  requirements: Array<Requirement>
  members: Array<string>
  telegramGroupId?: string
  discordRole?: string
  logic?: Logic
}

type Group = {
  id: number
  name: string
  urlName: string
  imageUrl?: string
  description?: string
  guilds: Array<{ groupId: number; guildId: number; guild: Guild }>
  members: Array<string> // TEMP
  owner?: {
    id: number
    addresses: Array<string>
  }
  theme?: Array<{
    color?: string
    mode?: "DARK" | "LIGHT"
  }>
}

enum RequirementTypeColors {
  ERC721 = "#4ade80", // green.400
  POAP = "#60a5fa", // blue.400
  ERC20 = "#818CF8", // indigo.400
  ETHER = "#818CF8", // indigo.400
  SNAPSHOT = "#ED8936", // orange.400
  WHITELIST = "#b0b0b9", // gray.200
}

type SnapshotStrategy = {
  name: string
  params: Record<string, Record<string, string>>
}

export type {
  CoingeckoToken,
  Poap,
  User,
  NFT,
  PlatformName,
  Guild,
  Level,
  Platform,
  Group,
  Requirement,
  RequirementType,
  SnapshotStrategy,
}
export { RequirementTypeColors }
