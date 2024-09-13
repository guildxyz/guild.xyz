import dynamic from "next/dynamic"
import { RequirementFormProps, RequirementType } from "./types"

export const REQUIREMENT_FORM_COMPONENTS = {
  FREE: null,
  ERC721: dynamic<RequirementFormProps>(() => import("requirements/Nft/NftForm")),
  ERC1155: dynamic<RequirementFormProps>(() => import("requirements/Nft/NftForm")),
  NOUNS: dynamic<RequirementFormProps>(() => import("requirements/Nft/NftForm")),
  COIN: dynamic<RequirementFormProps>(() => import("requirements/Token/TokenForm")),
  ERC20: dynamic<RequirementFormProps>(() => import("requirements/Token/TokenForm")),
  ALLOWLIST: dynamic<RequirementFormProps>(
    () => import("requirements/Allowlist/AllowlistForm")
  ),
  ALLOWLIST_EMAIL: dynamic<RequirementFormProps>(
    () => import("requirements/Allowlist/AllowlistForm")
  ),
  GUILD_SNAPSHOT: null,
  PAYMENT: dynamic<RequirementFormProps>(
    () => import("requirements/Payment/PaymentForm")
  ),
  CONTRACT: dynamic<RequirementFormProps>(
    () => import("requirements/ContractState/ContractStateForm")
  ),
  // TODO: TX_VALUE requirements are deprecated
  COVALENT_TX_VALUE: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  COVALENT_TX_VALUE_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  COVALENT_FIRST_TX: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  COVALENT_FIRST_TX_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  COVALENT_CONTRACT_DEPLOY: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  COVALENT_CONTRACT_DEPLOY_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  COVALENT_TX_COUNT: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  COVALENT_TX_COUNT_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  ALCHEMY_TX_VALUE: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  ALCHEMY_TX_VALUE_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  ALCHEMY_FIRST_TX: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  ALCHEMY_FIRST_TX_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  ALCHEMY_CONTRACT_DEPLOY: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  ALCHEMY_CONTRACT_DEPLOY_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  ALCHEMY_TX_COUNT: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  ALCHEMY_TX_COUNT_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/WalletActivity/WalletActivityForm")
  ),
  CAPTCHA: dynamic<RequirementFormProps>(
    () => import("requirements/Captcha/CaptchaForm")
  ),
  GUILD_ROLE: dynamic<RequirementFormProps>(
    () => import("requirements/Guild/GuildForm")
  ),
  GUILD_ROLE_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/Guild/GuildForm")
  ),
  GUILD_MINGUILDS: dynamic<RequirementFormProps>(
    () => import("requirements/Guild/GuildForm")
  ),
  GUILD_ADMIN: dynamic<RequirementFormProps>(
    () => import("requirements/Guild/GuildForm")
  ),
  GUILD_USER_SINCE: dynamic<RequirementFormProps>(
    () => import("requirements/Guild/GuildForm")
  ),
  GUILD_MEMBER: dynamic<RequirementFormProps>(
    () => import("requirements/Guild/GuildForm")
  ),
  POINTS_AMOUNT: dynamic<RequirementFormProps>(
    () => import("requirements/Points/PointsForm")
  ),
  POINTS_TOTAL_AMOUNT: dynamic<RequirementFormProps>(
    () => import("requirements/Points/PointsForm")
  ),
  POINTS_RANK: dynamic<RequirementFormProps>(
    () => import("requirements/Points/PointsForm")
  ),
  LINK_VISIT: dynamic<RequirementFormProps>(
    () => import("requirements/VisitLink/VisitLinkForm")
  ),
  EMAIL_VERIFIED: dynamic<RequirementFormProps>(
    () => import("requirements/Email/EmailForm")
  ),
  EMAIL_DOMAIN: dynamic<RequirementFormProps>(
    () => import("requirements/Email/EmailForm")
  ),
  FORM_SUBMISSION: dynamic<RequirementFormProps>(
    () => import("requirements/Form/FormForm")
  ),
  // TODO: this is a deprecated requirement
  FORM_APPROVAL: dynamic<RequirementFormProps>(
    () => import("requirements/Form/FormForm")
  ),
  WORLD_ID_VERIFICATION: dynamic<RequirementFormProps>(
    () => import("requirements/WorldID/WorldIDForm")
  ),
  TWITTER_ACCOUNT_AGE: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_ACCOUNT_AGE_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_ACCOUNT_PROTECTED: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_ACCOUNT_VERIFIED: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_BIO: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_FOLLOW: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_FOLLOWED_BY: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_FOLLOWER_COUNT: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_FOLLOWING_COUNT: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_FOLLOW_V2: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_LIKE: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_LIKE_COUNT: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_LIKE_V2: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_LIST_MEMBER: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_NAME: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_RETWEET: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_RETWEET_V2: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  TWITTER_TWEET_COUNT: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  // TODO: this is a deprecated requirement
  TWITTER_LIST_FOLLOW: dynamic<RequirementFormProps>(
    () => import("requirements/Twitter/TwitterForm")
  ),
  GITHUB_STARRING: dynamic<RequirementFormProps>(
    () => import("requirements/Github/GithubForm")
  ),
  GITHUB_ACCOUNT_AGE: dynamic<RequirementFormProps>(
    () => import("requirements/Github/GithubForm")
  ),
  GITHUB_ACCOUNT_AGE_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/Github/GithubForm")
  ),
  GITHUB_COMMIT_COUNT: dynamic<RequirementFormProps>(
    () => import("requirements/Github/GithubForm")
  ),
  GITHUB_COMMIT_COUNT_RELATIVE: dynamic<RequirementFormProps>(
    () => import("requirements/Github/GithubForm")
  ),
  DISCORD_ROLE: dynamic<RequirementFormProps>(
    () => import("requirements/Discord/DiscordForm")
  ),
  DISCORD_JOIN: dynamic<RequirementFormProps>(
    () => import("requirements/Discord/DiscordForm")
  ),
  DISCORD_JOIN_FROM_NOW: dynamic<RequirementFormProps>(
    () => import("requirements/Discord/DiscordForm")
  ),
  DISCORD_MEMBER_SINCE: dynamic<RequirementFormProps>(
    () => import("requirements/Discord/DiscordForm")
  ),
  COINBASE_EAS_ATTESTED_BY: dynamic<RequirementFormProps>(
    () => import("requirements/CoinbaseEAS/CoinbaseEASForm")
  ),
  UNISWAP_V3_POSITIONS: dynamic<RequirementFormProps>(
    () => import("requirements/Uniswap/UniswapForm")
  ),
  POLYGON_ID_BASIC: dynamic<RequirementFormProps>(
    () => import("requirements/PolygonID/PolygonIDForm")
  ),
  POLYGON_ID_QUERY: dynamic<RequirementFormProps>(
    () => import("requirements/PolygonID/PolygonIDForm")
  ),
  GITCOIN_PASS: dynamic<RequirementFormProps>(
    () => import("requirements/GitcoinPassport/GitcoinPassportForm")
  ),
  GITCOIN_STAMP: dynamic<RequirementFormProps>(
    () => import("requirements/GitcoinPassport/GitcoinPassportForm")
  ),
  GITCOIN_SCORE: dynamic<RequirementFormProps>(
    () => import("requirements/GitcoinPassport/GitcoinPassportForm")
  ),
  POAP: dynamic<RequirementFormProps>(() => import("requirements/Poap/PoapForm")),
  GITPOAP: dynamic<RequirementFormProps>(
    () => import("requirements/GitPoap/GitPoapForm")
  ),
  EAS_ATTEST: dynamic<RequirementFormProps>(
    () => import("requirements/EthereumAttestation/EthereumAttestationForm")
  ),
  EAS_ATTESTED_BY: dynamic<RequirementFormProps>(
    () => import("requirements/EthereumAttestation/EthereumAttestationForm")
  ),
  FARCASTER_PROFILE: dynamic<RequirementFormProps>(
    () => import("requirements/Farcaster/FarcasterForm")
  ),
  FARCASTER_TOTAL_FOLLOWERS: dynamic<RequirementFormProps>(
    () => import("requirements/Farcaster/FarcasterForm")
  ),
  FARCASTER_FOLLOW: dynamic<RequirementFormProps>(
    () => import("requirements/Farcaster/FarcasterForm")
  ),
  FARCASTER_FOLLOW_CHANNEL: dynamic<RequirementFormProps>(
    () => import("requirements/Farcaster/FarcasterForm")
  ),
  FARCASTER_FOLLOWED_BY: dynamic<RequirementFormProps>(
    () => import("requirements/Farcaster/FarcasterForm")
  ),
  FARCASTER_LIKE: dynamic<RequirementFormProps>(
    () => import("requirements/Farcaster/FarcasterForm")
  ),
  FARCASTER_RECAST: dynamic<RequirementFormProps>(
    () => import("requirements/Farcaster/FarcasterForm")
  ),
  FARCASTER_USERNAME: dynamic<RequirementFormProps>(
    () => import("requirements/Farcaster/FarcasterForm")
  ),
  FARCASTER_BIO: dynamic<RequirementFormProps>(
    () => import("requirements/Farcaster/FarcasterForm")
  ),
  LENS_PROFILE: dynamic<RequirementFormProps>(
    () => import("requirements/Lens/LensForm")
  ),
  LENS_FOLLOW: dynamic<RequirementFormProps>(
    () => import("requirements/Lens/LensForm")
  ),
  LENS_REACT: dynamic<RequirementFormProps>(
    () => import("requirements/Lens/LensForm")
  ),
  LENS_COLLECT: dynamic<RequirementFormProps>(
    () => import("requirements/Lens/LensForm")
  ),
  LENS_ACTION: dynamic<RequirementFormProps>(
    () => import("requirements/Lens/LensForm")
  ),
  LENS_TOTAL_FOLLOWERS: dynamic<RequirementFormProps>(
    () => import("requirements/Lens/LensForm")
  ),
  LENS_TOTAL_POSTS: dynamic<RequirementFormProps>(
    () => import("requirements/Lens/LensForm")
  ),
  LENS_FOLLOWED_BY: dynamic<RequirementFormProps>(
    () => import("requirements/Lens/LensForm")
  ),
  WEB3INBOX_SUBSCRIBERS: dynamic<RequirementFormProps>(
    () => import("requirements/Web3Inbox/Web3InboxForm")
  ),
  GALAXY: dynamic<RequirementFormProps>(
    () => import("requirements/Galaxy/GalaxyForm")
  ),
  GALAXY_PARTICIPATION: dynamic<RequirementFormProps>(
    () => import("requirements/Galaxy/GalaxyForm")
  ),
  SNAPSHOT_STRATEGY: dynamic<RequirementFormProps>(
    () => import("requirements/Snapshot/SnapshotForm")
  ),
  SNAPSHOT_SPACE_ADMIN: dynamic<RequirementFormProps>(
    () => import("requirements/Snapshot/SnapshotForm")
  ),
  SNAPSHOT_SPACE_AUTHOR: dynamic<RequirementFormProps>(
    () => import("requirements/Snapshot/SnapshotForm")
  ),
  SNAPSHOT_FOLLOW: dynamic<RequirementFormProps>(
    () => import("requirements/Snapshot/SnapshotForm")
  ),
  SNAPSHOT_FOLLOW_SINCE: dynamic<RequirementFormProps>(
    () => import("requirements/Snapshot/SnapshotForm")
  ),
  SNAPSHOT_USER_SINCE: dynamic<RequirementFormProps>(
    () => import("requirements/Snapshot/SnapshotForm")
  ),
  SNAPSHOT_VOTES: dynamic<RequirementFormProps>(
    () => import("requirements/Snapshot/SnapshotForm")
  ),
  SNAPSHOT_PROPOSALS: dynamic<RequirementFormProps>(
    () => import("requirements/Snapshot/SnapshotForm")
  ),
  SNAPSHOT_MAJORITY_VOTES: dynamic<RequirementFormProps>(
    () => import("requirements/Snapshot/SnapshotForm")
  ),
  MIRROR_COLLECT: dynamic<RequirementFormProps>(
    () => import("requirements/Mirror/MirrorForm")
  ),
  SOUND_ARTIST_BACKED: dynamic<RequirementFormProps>(
    () => import("requirements/Sound/SoundForm")
  ),
  SOUND_COLLECTED: dynamic<RequirementFormProps>(
    () => import("requirements/Sound/SoundForm")
  ),
  SOUND_ARTIST: dynamic<RequirementFormProps>(
    () => import("requirements/Sound/SoundForm")
  ),
  SOUND_TOP_COLLECTOR: dynamic<RequirementFormProps>(
    () => import("requirements/Sound/SoundForm")
  ),
  SOUND_NFTS: dynamic<RequirementFormProps>(
    () => import("requirements/Sound/SoundForm")
  ),
  DISCO: dynamic<RequirementFormProps>(() => import("requirements/Disco/DiscoForm")),
  UNLOCK: dynamic<RequirementFormProps>(
    () => import("requirements/Unlock/UnlockForm")
  ),
  JUICEBOX: dynamic<RequirementFormProps>(
    () => import("requirements/Juicebox/JuiceboxForm")
  ),
  FUEL_BALANCE: dynamic<RequirementFormProps>(
    () => import("requirements/Fuel/FuelForm")
  ),
  FUEL_TRANSACTIONS: dynamic<RequirementFormProps>(
    () => import("requirements/Fuel/FuelForm")
  ),
  NOOX: dynamic<RequirementFormProps>(() => import("requirements/Noox/NooxForm")),
  YUP: dynamic<RequirementFormProps>(() => import("requirements/Yup/YupForm")),
  REP3: dynamic<RequirementFormProps>(() => import("requirements/Rep3/Rep3Form")),
  PARALLEL_ID: dynamic<RequirementFormProps>(
    () => import("requirements/Parallel/ParallelForm")
  ),
  PARALLEL_SANCTIONS_SAFE: dynamic<RequirementFormProps>(
    () => import("requirements/Parallel/ParallelForm")
  ),
  PARALLEL_TRAIT: dynamic<RequirementFormProps>(
    () => import("requirements/Parallel/ParallelForm")
  ),
} as const satisfies Record<
  RequirementType,
  ReturnType<typeof dynamic<RequirementFormProps>> | null
>
