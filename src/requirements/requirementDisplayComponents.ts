import type { RequirementProps } from "components/[guild]/Requirements/components/Requirement"
import dynamic from "next/dynamic"
import { ComponentType } from "react"
import { RequirementType } from "./types"

export const REQUIREMENT_DISPLAY_COMPONENTS = {
  FREE: dynamic<RequirementProps>(() => import("requirements/Free/FreeRequirement")),
  ERC721: dynamic<RequirementProps>(() => import("requirements/Nft/NftRequirement")),
  ERC1155: dynamic<RequirementProps>(
    () => import("requirements/Nft/NftRequirement")
  ),
  NOUNS: dynamic<RequirementProps>(() => import("requirements/Nft/NftRequirement")),
  COIN: dynamic<RequirementProps>(
    () => import("requirements/Token/TokenRequirement")
  ),
  ERC20: dynamic<RequirementProps>(
    () => import("requirements/Token/TokenRequirement")
  ),
  ALLOWLIST: dynamic<RequirementProps>(
    () => import("requirements/Allowlist/AllowlistRequirement")
  ),
  ALLOWLIST_EMAIL: dynamic<RequirementProps>(
    () => import("requirements/Allowlist/AllowlistRequirement")
  ),
  GUILD_SNAPSHOT: dynamic<RequirementProps>(
    () => import("requirements/Airdrop/AirdropRequirement")
  ),
  PAYMENT: dynamic<RequirementProps>(
    () => import("requirements/Payment/PaymentRequirement")
  ),
  CONTRACT: dynamic<RequirementProps>(
    () => import("requirements/ContractState/ContractStateRequirement")
  ),
  // TODO: TX_VALUE requirements are deprecated
  COVALENT_TX_VALUE: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  COVALENT_TX_VALUE_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  COVALENT_FIRST_TX: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  COVALENT_FIRST_TX_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  COVALENT_CONTRACT_DEPLOY: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  COVALENT_CONTRACT_DEPLOY_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  COVALENT_TX_COUNT: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  COVALENT_TX_COUNT_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  ALCHEMY_TX_VALUE: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  ALCHEMY_TX_VALUE_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  ALCHEMY_FIRST_TX: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  ALCHEMY_FIRST_TX_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  ALCHEMY_CONTRACT_DEPLOY: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  ALCHEMY_CONTRACT_DEPLOY_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  ALCHEMY_TX_COUNT: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  ALCHEMY_TX_COUNT_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/WalletActivity/WalletActivityRequirement")
  ),
  CAPTCHA: dynamic<RequirementProps>(
    () => import("requirements/Captcha/CaptchaRequirement")
  ),
  GUILD_ROLE: dynamic<RequirementProps>(
    () => import("requirements/Guild/GuildRequirement")
  ),
  GUILD_ROLE_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/Guild/GuildRequirement")
  ),
  GUILD_MINGUILDS: dynamic<RequirementProps>(
    () => import("requirements/Guild/GuildRequirement")
  ),
  GUILD_ADMIN: dynamic<RequirementProps>(
    () => import("requirements/Guild/GuildRequirement")
  ),
  GUILD_USER_SINCE: dynamic<RequirementProps>(
    () => import("requirements/Guild/GuildRequirement")
  ),
  GUILD_MEMBER: dynamic<RequirementProps>(
    () => import("requirements/Guild/GuildRequirement")
  ),
  POINTS_AMOUNT: dynamic<RequirementProps>(
    () => import("requirements/Points/PointsRequirement")
  ),
  POINTS_TOTAL_AMOUNT: dynamic<RequirementProps>(
    () => import("requirements/Points/PointsRequirement")
  ),
  POINTS_RANK: dynamic<RequirementProps>(
    () => import("requirements/Points/PointsRequirement")
  ),
  LINK_VISIT: dynamic<RequirementProps>(
    () => import("requirements/VisitLink/VisitLinkRequirement")
  ),
  EMAIL_VERIFIED: dynamic<RequirementProps>(
    () => import("requirements/Email/EmailRequirement")
  ),
  EMAIL_DOMAIN: dynamic<RequirementProps>(
    () => import("requirements/Email/EmailRequirement")
  ),
  FORM_SUBMISSION: dynamic<RequirementProps>(
    () => import("requirements/Form/FormRequirement")
  ),
  // TODO: this is a deprecated requirement
  FORM_APPROVAL: dynamic<RequirementProps>(
    () => import("requirements/Form/FormRequirement")
  ),
  WORLD_ID_VERIFICATION: dynamic<RequirementProps>(
    () => import("requirements/WorldID/WorldIDRequirement")
  ),
  TWITTER_ACCOUNT_AGE: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_ACCOUNT_AGE_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_ACCOUNT_PROTECTED: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_ACCOUNT_VERIFIED: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_BIO: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_FOLLOW: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_FOLLOWED_BY: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_FOLLOWER_COUNT: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_FOLLOWING_COUNT: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_FOLLOW_V2: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_LIKE: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_LIKE_COUNT: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_LIKE_V2: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_LIST_MEMBER: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_NAME: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_RETWEET: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_RETWEET_V2: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  TWITTER_TWEET_COUNT: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  // TODO: this is a deprecated requirement
  TWITTER_LIST_FOLLOW: dynamic<RequirementProps>(
    () => import("requirements/Twitter/TwitterRequirement")
  ),
  GITHUB_STARRING: dynamic<RequirementProps>(
    () => import("requirements/Github/GithubRequirement")
  ),
  GITHUB_ACCOUNT_AGE: dynamic<RequirementProps>(
    () => import("requirements/Github/GithubRequirement")
  ),
  GITHUB_ACCOUNT_AGE_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/Github/GithubRequirement")
  ),
  GITHUB_COMMIT_COUNT: dynamic<RequirementProps>(
    () => import("requirements/Github/GithubRequirement")
  ),
  GITHUB_COMMIT_COUNT_RELATIVE: dynamic<RequirementProps>(
    () => import("requirements/Github/GithubRequirement")
  ),
  DISCORD_ROLE: dynamic<RequirementProps>(
    () => import("requirements/Discord/DiscordRequirement")
  ),
  DISCORD_JOIN: dynamic<RequirementProps>(
    () => import("requirements/Discord/DiscordRequirement")
  ),
  DISCORD_JOIN_FROM_NOW: dynamic<RequirementProps>(
    () => import("requirements/Discord/DiscordRequirement")
  ),
  DISCORD_MEMBER_SINCE: dynamic<RequirementProps>(
    () => import("requirements/Discord/DiscordRequirement")
  ),
  COINBASE_EAS_ATTESTED_BY: dynamic<RequirementProps>(
    () => import("requirements/CoinbaseEAS/CoinbaseEASRequirement")
  ),
  UNISWAP_V3_POSITIONS: dynamic<RequirementProps>(
    () => import("requirements/Uniswap/UniswapRequirement")
  ),
  POLYGON_ID_BASIC: dynamic<RequirementProps>(
    () => import("requirements/PolygonID/PolygonIDRequirement")
  ),
  POLYGON_ID_QUERY: dynamic<RequirementProps>(
    () => import("requirements/PolygonID/PolygonIDRequirement")
  ),
  GITCOIN_PASS: dynamic<RequirementProps>(
    () => import("requirements/GitcoinPassport/GitcoinPassportRequirement")
  ),
  GITCOIN_STAMP: dynamic<RequirementProps>(
    () => import("requirements/GitcoinPassport/GitcoinPassportRequirement")
  ),
  GITCOIN_SCORE: dynamic<RequirementProps>(
    () => import("requirements/GitcoinPassport/GitcoinPassportRequirement")
  ),
  POAP: dynamic<RequirementProps>(() => import("requirements/Poap/PoapRequirement")),
  GITPOAP: dynamic<RequirementProps>(
    () => import("requirements/GitPoap/GitPoapRequirement")
  ),
  EAS_ATTEST: dynamic<RequirementProps>(
    () => import("requirements/EthereumAttestation/EthereumAttestationRequirement")
  ),
  EAS_ATTESTED_BY: dynamic<RequirementProps>(
    () => import("requirements/EthereumAttestation/EthereumAttestationRequirement")
  ),
  FARCASTER_PROFILE: dynamic<RequirementProps>(
    () => import("requirements/Farcaster/FarcasterRequirement")
  ),
  FARCASTER_TOTAL_FOLLOWERS: dynamic<RequirementProps>(
    () => import("requirements/Farcaster/FarcasterRequirement")
  ),
  FARCASTER_FOLLOW: dynamic<RequirementProps>(
    () => import("requirements/Farcaster/FarcasterRequirement")
  ),
  FARCASTER_FOLLOW_CHANNEL: dynamic<RequirementProps>(
    () => import("requirements/Farcaster/FarcasterRequirement")
  ),
  FARCASTER_FOLLOWED_BY: dynamic<RequirementProps>(
    () => import("requirements/Farcaster/FarcasterRequirement")
  ),
  FARCASTER_LIKE: dynamic<RequirementProps>(
    () => import("requirements/Farcaster/FarcasterRequirement")
  ),
  FARCASTER_RECAST: dynamic<RequirementProps>(
    () => import("requirements/Farcaster/FarcasterRequirement")
  ),
  FARCASTER_USERNAME: dynamic<RequirementProps>(
    () => import("requirements/Farcaster/FarcasterRequirement")
  ),
  FARCASTER_BIO: dynamic<RequirementProps>(
    () => import("requirements/Farcaster/FarcasterRequirement")
  ),
  LENS_PROFILE: dynamic<RequirementProps>(
    () => import("requirements/Lens/LensRequirement")
  ),
  LENS_FOLLOW: dynamic<RequirementProps>(
    () => import("requirements/Lens/LensRequirement")
  ),
  LENS_REACT: dynamic<RequirementProps>(
    () => import("requirements/Lens/LensRequirement")
  ),
  LENS_COLLECT: dynamic<RequirementProps>(
    () => import("requirements/Lens/LensRequirement")
  ),
  LENS_ACTION: dynamic<RequirementProps>(
    () => import("requirements/Lens/LensRequirement")
  ),
  LENS_TOTAL_FOLLOWERS: dynamic<RequirementProps>(
    () => import("requirements/Lens/LensRequirement")
  ),
  LENS_TOTAL_POSTS: dynamic<RequirementProps>(
    () => import("requirements/Lens/LensRequirement")
  ),
  LENS_FOLLOWED_BY: dynamic<RequirementProps>(
    () => import("requirements/Lens/LensRequirement")
  ),
  WEB3INBOX_SUBSCRIBERS: dynamic<RequirementProps>(
    () => import("requirements/Web3Inbox/Web3InboxRequirement")
  ),
  GALAXY: dynamic<RequirementProps>(
    () => import("requirements/Galaxy/GalaxyRequirement")
  ),
  GALAXY_PARTICIPATION: dynamic<RequirementProps>(
    () => import("requirements/Galaxy/GalaxyRequirement")
  ),
  SNAPSHOT_STRATEGY: dynamic<RequirementProps>(
    () => import("requirements/Snapshot/SnapshotRequirement")
  ),
  SNAPSHOT_SPACE_ADMIN: dynamic<RequirementProps>(
    () => import("requirements/Snapshot/SnapshotRequirement")
  ),
  SNAPSHOT_SPACE_AUTHOR: dynamic<RequirementProps>(
    () => import("requirements/Snapshot/SnapshotRequirement")
  ),
  SNAPSHOT_FOLLOW: dynamic<RequirementProps>(
    () => import("requirements/Snapshot/SnapshotRequirement")
  ),
  SNAPSHOT_FOLLOW_SINCE: dynamic<RequirementProps>(
    () => import("requirements/Snapshot/SnapshotRequirement")
  ),
  SNAPSHOT_USER_SINCE: dynamic<RequirementProps>(
    () => import("requirements/Snapshot/SnapshotRequirement")
  ),
  SNAPSHOT_VOTES: dynamic<RequirementProps>(
    () => import("requirements/Snapshot/SnapshotRequirement")
  ),
  SNAPSHOT_PROPOSALS: dynamic<RequirementProps>(
    () => import("requirements/Snapshot/SnapshotRequirement")
  ),
  SNAPSHOT_MAJORITY_VOTES: dynamic<RequirementProps>(
    () => import("requirements/Snapshot/SnapshotRequirement")
  ),
  MIRROR_COLLECT: dynamic<RequirementProps>(
    () => import("requirements/Mirror/MirrorRequirement")
  ),
  SOUND_ARTIST_BACKED: dynamic<RequirementProps>(
    () => import("requirements/Sound/SoundRequirement")
  ),
  SOUND_COLLECTED: dynamic<RequirementProps>(
    () => import("requirements/Sound/SoundRequirement")
  ),
  SOUND_ARTIST: dynamic<RequirementProps>(
    () => import("requirements/Sound/SoundRequirement")
  ),
  SOUND_TOP_COLLECTOR: dynamic<RequirementProps>(
    () => import("requirements/Sound/SoundRequirement")
  ),
  SOUND_NFTS: dynamic<RequirementProps>(
    () => import("requirements/Sound/SoundRequirement")
  ),
  DISCO: dynamic<RequirementProps>(
    () => import("requirements/Disco/DiscoRequirement")
  ),
  UNLOCK: dynamic<RequirementProps>(
    () => import("requirements/Unlock/UnlockRequirement")
  ),
  JUICEBOX: dynamic<RequirementProps>(
    () => import("requirements/Juicebox/JuiceboxRequirement")
  ),
  FUEL_BALANCE: dynamic<RequirementProps>(
    () => import("requirements/Fuel/FuelRequirement")
  ),
  FUEL_TRANSACTIONS: dynamic<RequirementProps>(
    () => import("requirements/Fuel/FuelRequirement")
  ),
  NOOX: dynamic<RequirementProps>(() => import("requirements/Noox/NooxRequirement")),
  YUP: dynamic<RequirementProps>(() => import("requirements/Yup/YupRequirement")),
  REP3: dynamic<RequirementProps>(() => import("requirements/Rep3/Rep3Requirement")),
  PARALLEL_ID: dynamic<RequirementProps>(
    () => import("requirements/Parallel/ParallelRequirement")
  ),
  PARALLEL_SANCTIONS_SAFE: dynamic<RequirementProps>(
    () => import("requirements/Parallel/ParallelRequirement")
  ),
  PARALLEL_TRAIT: dynamic<RequirementProps>(
    () => import("requirements/Parallel/ParallelRequirement")
  ),
} as const satisfies Record<RequirementType, ComponentType<RequirementProps>>
