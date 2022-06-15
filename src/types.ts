type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
}

type DiscordError = { error: string; errorDescription: string }

type WalletError = { code: number; message: string }

type Rest = {
  [x: string]: any
}

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
  | "ERC1155"
  | "POAP"
  | "MIRROR"
  | "UNLOCK"
  | "SNAPSHOT"
  | "JUICEBOX"
  | "ALLOWLIST"
  | "FREE"

type SupportedChains =
  | "ETHEREUM"
  | "POLYGON"
  | "GNOSIS"
  | "BSC"
  | "AVALANCHE"
  | "FANTOM"
  | "BSC"
  | "OPTIMISM"
  | "MOONRIVER"
  | "RINKEBY"
  | "METIS"
  | "CRONOS"
  | "BOBA"

type NftRequirementType = "AMOUNT" | "ATTRIBUTE" | "CUSTOM_ID"

type GuildFormType = {
  name?: string
  urlName?: string
  imageUrl?: string
  customImage?: string
  description?: string
  theme: Theme
  guildPlatforms?: Array<{
    platformName?: PlatformName
    platformGuildId?: string
    data?: any // ???
  }>
  roles: Array<Role>
  isGuarded?: boolean
  grantAccessToExistingUsers?: boolean
}

type PlatformName = "TELEGRAM" | "DISCORD"

type User =
  | {
      id: number
      addresses: number
      telegramId?: boolean
      discordId?: boolean
      discord?: null
      telegram?: null
    }
  | {
      id: number
      addresses: Array<string>
      telegramId?: string
      discordId?: string
      discord?: {
        username: string
        avatar: string
      }
      telegram?: {
        username: string
        avatar: string
      }
    }

type GuildBase = {
  name: string
  urlName: string
  imageUrl: string
  roles: Array<string>
  memberCount: number
}

type GuildAdmin = {
  id: number
  address: string
  isOwner: boolean
}

type PlatformGuildData = {
  DISCORD: {
    inviteChannel: string
  }
}

type PlatformRoleData = {
  DISCORD: {
    isGuarded: boolean
  }
}

type Requirement = {
  id: number
  data?: {
    hideAllowlist?: boolean
    minAmount?: number
    maxAmount?: number
    addresses?: Array<string> // (ALLOWLIST)
    id?: string // fancy_id (POAP), edition id (MIRROR), id of the project (JUICEBOX)
    strategy?: {
      name: string
      params: Record<string, any>
    } // SNAPSHOT
    attribute?: {
      trait_type?: string
      value?: string
      interval?: {
        min: number
        max: number
      }
    }
  }
  name: string
  type: RequirementType
  chain: SupportedChains
  roleId: number
  symbol: string
  address: string

  // Props used inside the forms on the UI
  // id?: string
  // active?: boolean
  // nftRequirementType?: string
}

type RolePlatform = {
  platformRoleId?: string
  guildPlatformId: number
  platformRoleData?: PlatformRoleData[keyof PlatformRoleData]
}

type Role = {
  id: number
  name: string
  logic: Logic
  members: string[]
  imageUrl?: string
  description?: string
  memberCount: number
  // owner?: User
  requirements: Requirement[]
  rolePlatforms: RolePlatform[]
  /**
   * Az alap koncepcio az az, hogy a guildPlatforms az egy guildhez tartozo
   * platformot jelent, a rolePlatform pedig egy guildPlatforrm es egy role
   * osszekapcsolasa discord eseted a guildPlatform-ban van a platformGuildId, ami a
   * serverId, a rolePlatform-ban pedig a guildPlatformId-ja, es a platformRoleId ami
   * a dc role id-ja telegram eseten a guildPlatform-ban van a groupId, a
   * rolePlatform pedig a roleId es a guildPlatformId alapjan osszekapcsolja a
   * kettot, de mas additional infot nem tartalmaz
   */
}

type Platform = {
  id: number
  platformId: number
  platformGuildId: string
  platformGuildData?: PlatformGuildData[keyof PlatformGuildData]
}

type Guild = {
  id: number
  name: string
  urlName: string
  description?: string
  imageUrl: string
  showMembers: boolean
  hideFromExplorer: boolean
  createdAt: string
  admins: GuildAdmin[]
  theme: Theme
  guildPlatforms: Platform[]
  roles: Role[]
}

enum RequirementTypeColors {
  ERC721 = "var(--chakra-colors-green-400)",
  ERC1155 = "var(--chakra-colors-green-400)",
  POAP = "var(--chakra-colors-blue-400)",
  MIRROR = "var(--chakra-colors-gray-300)",
  ERC20 = "var(--chakra-colors-indigo-400)",
  COIN = "var(--chakra-colors-indigo-400)",
  SNAPSHOT = "var(--chakra-colors-orange-400)",
  ALLOWLIST = "var(--chakra-colors-gray-200)",
  UNLOCK = "var(--chakra-colors-salmon-400)",
  JUICEBOX = "var(--chakra-colors-yellow-500)",
  FREE = "var(--chakra-colors-cyan-400)",
}

type SnapshotStrategy = {
  name: string
  params: Record<string, Record<string, string>>
}

type JuiceboxProject = {
  id: string
  uri: string
  name: string
  logoUri: string
}

type MirrorEdition = {
  editionContractAddress: string
  editionId: number
  title: string
  image: string
}

type SelectOption = {
  label: string
  value: string
  img?: string
} & Rest

// Requested with Discord OAuth token
type DiscordServerData = {
  id: string
  name: string
  icon: string
  owner: boolean
  permissions: number
  features: string[]
  permissions_new: string
}

export type {
  DiscordServerData,
  GuildAdmin,
  Token,
  DiscordError,
  WalletError,
  Rest,
  CoingeckoToken,
  Poap,
  User,
  NFT,
  PlatformName,
  Role,
  Platform,
  GuildBase,
  Guild,
  Requirement,
  RequirementType,
  SupportedChains,
  SnapshotStrategy,
  JuiceboxProject,
  MirrorEdition,
  ThemeMode,
  Logic,
  SelectOption,
  NftRequirementType,
  GuildFormType,
}
export { RequirementTypeColors }
