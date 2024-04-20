import { RequirementProps } from "components/[guild]/Requirements/components/Requirement"
import dynamic from "next/dynamic"
import {
  Coins,
  CurrencyCircleDollar,
  ImageSquare,
  Link,
  ListChecks,
  Robot,
  Wallet,
  Wrench,
} from "phosphor-react"
import rewards from "platforms/rewards"
import { RequirementFormProps } from "requirements"
import { VISIT_LINK_REGEX } from "requirements/VisitLink/VisitLinkRequirement"
import Star from "static/icons/star.svg"
import GuildLogo from "static/logo.svg"

export const REQUIREMENTS_DATA = [
  {
    icon: Wallet,
    name: "Free",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Free/FreeRequirement")
    ),
    types: ["FREE"],
  },
  {
    icon: ImageSquare,
    name: "NFT",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Nft/NftRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Nft/NftForm")
    ),
    types: ["ERC721", "ERC1155", "NOUNS"],
    isNegatable: true,
  },
  {
    icon: CurrencyCircleDollar,
    name: "Token",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Token/TokenRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Token/TokenForm")
    ),
    types: ["ERC20", "COIN"],
    isNegatable: true,
  },
  {
    icon: ListChecks,
    name: "Allowlist",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Allowlist/AllowlistRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Allowlist/AllowlistForm")
    ),
    types: ["ALLOWLIST", "ALLOWLIST_EMAIL"],
    isNegatable: true,
  },
  {
    icon: Coins,
    name: "Payment",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Payment/PaymentRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Payment/PaymentForm")
    ),
    types: ["PAYMENT"],
  },
  {
    icon: Wrench,
    name: "Contract query",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/ContractState/ContractStateRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/ContractState/ContractStateForm")
    ),
    types: ["CONTRACT"],
    isNegatable: true,
  },
  {
    icon: Wallet,
    name: "Wallet activity",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/WalletActivity/WalletActivityRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/WalletActivity/WalletActivityForm")
    ),
    types: [
      "WALLET_ACTIVITY",
      "COVALENT_FIRST_TX",
      "COVALENT_FIRST_TX_RELATIVE",
      "COVALENT_CONTRACT_DEPLOY",
      "COVALENT_CONTRACT_DEPLOY_RELATIVE",
      "COVALENT_TX_COUNT",
      "COVALENT_TX_COUNT_RELATIVE",
    ],
    isNegatable: true,
  },
  {
    icon: Robot,
    name: "Captcha",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Captcha/CaptchaRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Captcha/CaptchaForm")
    ),
    types: ["CAPTCHA"],
    isNegatable: true,
  },
  {
    icon: GuildLogo,
    name: "Guild",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Guild/GuildRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Guild/GuildForm")
    ),
    types: [
      "GUILD",
      "GUILD_ROLE",
      "GUILD_ROLE_RELATIVE",
      "GUILD_MINGUILDS",
      "GUILD_ADMIN",
      "GUILD_USER_SINCE",
      "GUILD_MEMBER",
    ],
    isNegatable: true,
  },
  {
    icon: Star,
    name: "Points",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Points/PointsRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Points/PointsForm")
    ),
    types: ["POINTS_AMOUNT", "POINTS_TOTAL_AMOUNT", "POINTS_RANK"],
    isNegatable: true,
  },
  {
    icon: Link,
    name: "Visit link",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/VisitLink/VisitLinkRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/VisitLink/VisitLinkForm")
    ),
    types: ["LINK_VISIT"],
    customNameRules: {
      pattern: {
        value: VISIT_LINK_REGEX,
        message:
          "Your text must contain a link label in square brackets, e.g. [Link Label].",
      },
    },
  },
  {
    icon: rewards.EMAIL.icon,
    name: rewards.EMAIL.name,
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Email/EmailRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Email/EmailForm")
    ),
    types: ["EMAIL", "EMAIL_VERIFIED", "EMAIL_DOMAIN"],
    isNegatable: true,
  },
  {
    icon: rewards.FORM.icon,
    name: rewards.FORM.name,
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Form/FormRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Form/FormForm")
    ),
    types: ["FORM_SUBMISSION"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/x.svg",
    name: "X",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Twitter/TwitterRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Twitter/TwitterForm")
    ),
    types: [
      "TWITTER",
      "TWITTER_ACCOUNT_AGE",
      "TWITTER_ACCOUNT_AGE_RELATIVE",
      "TWITTER_ACCOUNT_PROTECTED",
      "TWITTER_ACCOUNT_VERIFIED",
      "TWITTER_BIO",
      "TWITTER_FOLLOW",
      "TWITTER_FOLLOWED_BY",
      "TWITTER_FOLLOWER_COUNT",
      "TWITTER_FOLLOWING_COUNT",
      "TWITTER_FOLLOW_V2",
      "TWITTER_LIKE",
      "TWITTER_LIKE_COUNT",
      "TWITTER_LIKE_V2",
      "TWITTER_LIST_MEMBER",
      "TWITTER_NAME",
      "TWITTER_RETWEET",
      "TWITTER_RETWEET_V2",
      "TWITTER_TWEET_COUNT",
    ],
    isPlatform: true,
    isNegatable: true,
  },
  {
    icon: "/platforms/github.png",
    name: "GitHub",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Github/GithubRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Github/GithubForm")
    ),
    types: [
      "GITHUB",
      "GITHUB_STARRING",
      "GITHUB_ACCOUNT_AGE",
      "GITHUB_ACCOUNT_AGE_RELATIVE",
      "GITHUB_COMMIT_COUNT",
      "GITHUB_COMMIT_COUNT_RELATIVE",
    ],
    isPlatform: true,
    isNegatable: true,
  },
  {
    icon: "/platforms/discord.png",
    name: "Discord",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Discord/DiscordRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Discord/DiscordForm")
    ),
    types: [
      "DISCORD",
      "DISCORD_ROLE",
      "DISCORD_JOIN",
      "DISCORD_JOIN_FROM_NOW",
      "DISCORD_MEMBER_SINCE",
    ],
    isPlatform: true,
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/coinbase.png",
    name: "Coinbase",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/CoinbaseEAS/CoinbaseEASRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/CoinbaseEAS/CoinbaseEASForm")
    ),
    types: ["COINBASE_EAS_ATTESTED_BY"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/polygonId.svg",
    name: "PolygonID",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/PolygonID/PolygonIDRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/PolygonID/PolygonIDForm")
    ),
    types: ["POLYGON_ID_QUERY", "POLYGON_ID_BASIC"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/gitcoin-passport.svg",
    name: "Gitcoin Passport",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/GitcoinPassport/GitcoinPassportRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/GitcoinPassport/GitcoinPassportForm")
    ),
    types: ["GITCOIN", "GITCOIN_PASS", "GITCOIN_STAMP", "GITCOIN_SCORE"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/poap.svg",
    name: "Poap",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Poap/PoapRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Poap/PoapForm")
    ),
    types: ["POAP"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/gitpoap.svg",
    name: "GitPOAP",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/GitPoap/GitPoapRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/GitPoap/GitPoapForm")
    ),
    types: ["GITPOAP"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/eas.png",
    name: "EAS",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/EthereumAttestation/EthereumAttestationRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/EthereumAttestation/EthereumAttestationForm")
    ),
    types: ["EAS_ATTESTED_BY", "EAS_ATTEST"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/farcaster.png",
    name: "Farcaster",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Farcaster/FarcasterRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Farcaster/FarcasterForm")
    ),
    types: [
      "FARCASTER",
      "FARCASTER_PROFILE",
      "FARCASTER_TOTAL_FOLLOWERS",
      "FARCASTER_FOLLOW",
      "FARCASTER_FOLLOW_CHANNEL",
      "FARCASTER_FOLLOWED_BY",
      "FARCASTER_LIKE",
      "FARCASTER_RECAST",
      "FARCASTER_USERNAME",
      "FARCASTER_BIO",
    ],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/lens.svg",
    name: "Lens",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Lens/LensRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Lens/LensForm")
    ),
    types: [
      "LENS",
      "LENS_PROFILE",
      "LENS_FOLLOW",
      "LENS_REACT",
      "LENS_COLLECT",
      "LENS_ACTION",
      "LENS_TOTAL_FOLLOWERS",
      "LENS_TOTAL_POSTS",
      "LENS_FOLLOWED_BY",
    ],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/web3inbox.png",
    name: "Web3Inbox",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Web3Inbox/Web3InboxRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Web3Inbox/Web3InboxForm")
    ),
    types: ["WEB3INBOX_SUBSCRIBERS"],
  },
  {
    icon: "/requirementLogos/galaxy.svg",
    name: "Galxe",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Galaxy/GalaxyRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Galaxy/GalaxyForm")
    ),
    types: ["GALAXY", "GALAXY_PARTICIPATION"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/snapshot.png",
    name: "Snapshot",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Snapshot/SnapshotRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Snapshot/SnapshotForm")
    ),
    types: [
      "SNAPSHOT",
      "SNAPSHOT_STRATEGY",
      "SNAPSHOT_SPACE_ADMIN",
      "SNAPSHOT_SPACE_AUTHOR",
      "SNAPSHOT_FOLLOW",
      "SNAPSHOT_FOLLOW_SINCE",
      "SNAPSHOT_USER_SINCE",
      "SNAPSHOT_VOTES",
      "SNAPSHOT_PROPOSALS",
      "SNAPSHOT_MAJORITY_VOTES",
    ],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/mirror.svg",
    name: "Mirror",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Mirror/MirrorRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Mirror/MirrorForm")
    ),
    types: ["MIRROR_COLLECT", "MIRROR"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/sound.png",
    name: "Sound",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Sound/SoundRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Sound/SoundForm")
    ),
    types: [
      "SOUND",
      "SOUND_ARTIST_BACKED",
      "SOUND_COLLECTED",
      "SOUND_ARTIST",
      "SOUND_TOP_COLLECTOR",
      "SOUND_NFTS",
    ],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/disco.png",
    name: "Disco",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Disco/DiscoRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Disco/DiscoForm")
    ),
    types: ["DISCO"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/unlock.png",
    name: "Unlock",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Unlock/UnlockRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Unlock/UnlockForm")
    ),
    types: ["UNLOCK"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/juicebox.png",
    name: "Juicebox",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Juicebox/JuiceboxRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Juicebox/JuiceboxForm")
    ),
    types: ["JUICEBOX"],
    isNegatable: true,
  },
  {
    icon: "/walletLogos/fuel.svg",
    name: "Fuel",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Fuel/FuelRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Fuel/FuelForm")
    ),
    types: ["FUEL", "FUEL_BALANCE", "FUEL_TRANSACTIONS"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/sismo.svg",
    name: "Sismo",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Sismo/SismoRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Sismo/SismoForm")
    ),
    types: ["SISMO"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/noox.svg",
    name: "Noox",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Noox/NooxRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Noox/NooxForm")
    ),
    types: ["NOOX"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/yup.svg",
    name: "Yup",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Yup/YupRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Yup/YupForm")
    ),
    types: ["YUP"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/rabbithole.png",
    name: "RabbitHole",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Rabbithole/RabbitholeRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Rabbithole/RabbitholeForm")
    ),
    types: ["RABBITHOLE"],
    isNegatable: true,
  },
  {
    icon: "/networkLogos/optimism.svg",
    name: "OP Attestation",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Optimism/OptimismRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Optimism/OptimismForm")
    ),
    types: ["OPTIMISM", "OPTIMISM_ATTESTATION", "OPTIMISM_PFP"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/rep3.png",
    name: "Rep3",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Rep3/Rep3Requirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Rep3/Rep3Form")
    ),
    types: ["REP3"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/parallel.png",
    name: "Parallel",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Parallel/ParallelRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Parallel/ParallelForm")
    ),
    types: ["PARALLEL_ID", "PARALLEL_SANCTIONS_SAFE", "PARALLEL_TRAIT"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/kycdao.svg",
    name: "kycDAO",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/KycDAO/KycDAORequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/KycDAO/KycDAOForm")
    ),
    types: ["KYC_DAO"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/otterspace.png",
    name: "Otterspace",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Otterspace/OtterspaceRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Otterspace/OtterspaceForm")
    ),
    types: ["OTTERSPACE"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/orange.png",
    name: "Orange",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Orange/OrangeRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Orange/OrangeForm")
    ),
    types: ["ORANGE"],
    isNegatable: true,
  },
  {
    icon: "/requirementLogos/cask.png",
    name: "Cask",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Cask/CaskRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Cask/CaskForm")
    ),
    types: ["CASK"],
    isNegatable: true,
  },
] as const

export default REQUIREMENTS_DATA
