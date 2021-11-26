type Logic = "AND" | "OR" | "NOR" | "NAND"

type ThemeMode = "LIGHT" | "DARK"

type Theme = {
  color?: string
  mode?: ThemeMode
  backgroundImage?: string
  backgroundCss?: string
}

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
  | "COIN"
  | "ERC20"
  | "ERC721"
  | "POAP"
  | "MIRROR"
  | "SNAPSHOT"
  | "WHITELIST"

type SupportedChains =
  | "ETHEREUM"
  | "POLYGON"
  | "XDAI"
  | "BSC"
  | "AVALANCHE"
  | "FANTOM"
  | "BSC"

type Requirement = {
  type: RequirementType
  address?: string
  symbol?: string
  method?: string
  key?: string
  value: string | Record<string, string | number> | Array<string> | [number, number] // [number, number] is only needed for easy form handling, we don't store it this way on the backend
  name?: string
  chain: SupportedChains
  interval?: [number, number] // Needed for easy form handling, we don't store it this way on the backend
}

type RequirementFormField = {
  id: string
  chain: SupportedChains
  type: RequirementType
  address: string
  key?: any
  value?: any
  interval?: any
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
  serverName: string
}

type User =
  | {
      id: number
      addresses: number
      telegramId?: boolean
      discordId?: boolean
    }
  | {
      id: number
      addresses: Array<string>
      telegramId?: string
      discordId?: string
    }

type Guild = {
  id: number
  name: string
  urlName: string
  imageUrl?: string
  description?: string
  owner?: User
  guildPlatforms: Array<Platform>
  themeColor: string
  themeMode?: ThemeMode
  requirements: Array<Requirement>
  members: Array<string>
  telegramGroupId?: string
  discordRole?: string
  logic?: Logic
}

type Hall = {
  id: number
  name: string
  urlName: string
  imageUrl?: string
  description?: string
  guilds: Array<{ groupId: number; guildId: number; guild: Guild }>
  members: Array<string> // TEMP
  owner?: User
  theme?: Array<Theme>
}

enum RequirementTypeColors {
  ERC721 = "var(--chakra-colors-green-400)",
  POAP = "var(--chakra-colors-blue-400)",
  MIRROR = "var(--chakra-colors-gray-300)",
  ERC20 = "var(--chakra-colors-indigo-400)",
  COIN = "var(--chakra-colors-indigo-400)",
  SNAPSHOT = "var(--chakra-colors-orange-400)",
  WHITELIST = "var(--chakra-colors-gray-200)",
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
  Hall,
  Requirement,
  RequirementType,
  SupportedChains,
  SnapshotStrategy,
  ThemeMode,
  RequirementFormField,
}
export { RequirementTypeColors }
