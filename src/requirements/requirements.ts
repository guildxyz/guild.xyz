import { RequirementProps } from "components/[guild]/Requirements/components/Requirement"
import dynamic from "next/dynamic"
import {
  Coins,
  CurrencyCircleDollar,
  ImageSquare,
  ListChecks,
  Robot,
  Wallet,
  Wrench,
} from "phosphor-react"
import { RequirementFormProps } from "requirements"
import GuildLogo from "static/logo.svg"

export const REQUIREMENTS_DATA = [
  {
    icon: Wallet,
    name: "Free",
    fileNameBase: "Free",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Free/FreeRequirement")
    ),
    types: ["FREE"],
  },
  {
    icon: ImageSquare,
    name: "NFT",
    fileNameBase: "Nft",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Nft/NftRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Nft/NftForm")
    ),
    types: ["ERC721", "ERC1155", "NOUNS"],
  },
  {
    icon: CurrencyCircleDollar,
    name: "Token",
    fileNameBase: "Token",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Token/TokenRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Token/TokenForm")
    ),
    types: ["ERC20", "COIN"],
  },
  {
    icon: ListChecks,
    name: "Allowlist",
    fileNameBase: "Allowlist",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Allowlist/AllowlistRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Allowlist/AllowlistForm")
    ),
    types: ["ALLOWLIST"],
  },
  {
    icon: Coins,
    name: "Payment",
    fileNameBase: "Payment",
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
    fileNameBase: "ContractState",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/ContractState/ContractStateRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/ContractState/ContractStateForm")
    ),
    types: ["CONTRACT"],
  },
  {
    icon: GuildLogo,
    name: "Guild",
    fileNameBase: "Guild",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Guild/GuildRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Guild/GuildForm")
    ),
    types: [
      "GUILD",
      "GUILD_ROLE",
      "GUILD_MINGUILDS",
      "GUILD_ADMIN",
      "GUILD_USER_SINCE",
    ],
  },
  {
    icon: Robot,
    name: "Captcha",
    fileNameBase: "Captcha",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Captcha/CaptchaRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Captcha/CaptchaForm")
    ),
    types: ["CAPTCHA"],
  },
  {
    icon: "/requirementLogos/twitter.svg",
    name: "Twitter",
    fileNameBase: "Twitter",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Twitter/TwitterRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Twitter/TwitterForm")
    ),
    types: [
      "TWITTER",
      "TWITTER_NAME",
      "TWITTER_BIO",
      "TWITTER_FOLLOW",
      "TWITTER_FOLLOWED_BY",
      "TWITTER_FOLLOWER_COUNT",
      "TWITTER_LIKE",
      "TWITTER_RETWEET",
      "TWITTER_LIST_MEMBER",
      "TWITTER_LIST_FOLLOW",
      "TWITTER_ACCOUNT_AGE",
      "TWITTER_ACCOUNT_AGE_RELATIVE",
    ],
    isPlatform: true,
  },
  {
    icon: "/platforms/github.png",
    name: "GitHub",
    fileNameBase: "Github",
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
  },
  {
    icon: "/platforms/discord.png",
    name: "Discord",
    fileNameBase: "Discord",
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
  },
  {
    icon: "/requirementLogos/unlock.png",
    name: "Unlock",
    fileNameBase: "Unlock",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Unlock/UnlockRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Unlock/UnlockForm")
    ),
    types: ["UNLOCK"],
  },
  {
    icon: "/requirementLogos/poap.svg",
    name: "Poap",
    fileNameBase: "Poap",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Poap/PoapRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Poap/PoapForm")
    ),
    types: ["POAP"],
  },
  {
    icon: "/requirementLogos/gitpoap.svg",
    name: "GitPOAP",
    fileNameBase: "GitPoap",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/GitPoap/GitPoapRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/GitPoap/GitPoapForm")
    ),
    types: ["GITPOAP"],
  },
  {
    icon: "/requirementLogos/mirror.svg",
    name: "Mirror",
    fileNameBase: "Mirror",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Mirror/MirrorRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Mirror/MirrorForm")
    ),
    types: ["MIRROR", "MIRROR_COLLECT"],
  },
  {
    icon: "/requirementLogos/snapshot.png",
    name: "Snapshot",
    fileNameBase: "Snapshot",
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
  },
  {
    icon: "/requirementLogos/juicebox.png",
    name: "Juicebox",
    fileNameBase: "Juicebox",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Juicebox/JuiceboxRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Juicebox/JuiceboxForm")
    ),
    types: ["JUICEBOX"],
  },
  {
    icon: "/requirementLogos/galaxy.svg",
    name: "Galxe",
    fileNameBase: "Galaxy",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Galaxy/GalaxyRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Galaxy/GalaxyForm")
    ),
    types: ["GALAXY"],
  },
  {
    icon: "/requirementLogos/noox.svg",
    name: "Noox",
    fileNameBase: "Noox",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Noox/NooxRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Noox/NooxForm")
    ),
    types: ["NOOX"],
  },
  {
    icon: "/requirementLogos/disco.png",
    name: "Disco",
    fileNameBase: "Disco",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Disco/DiscoRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Disco/DiscoForm")
    ),
    types: ["DISCO"],
  },
  {
    icon: "/requirementLogos/lens.png",
    name: "Lens",
    fileNameBase: "Lens",
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
      "LENS_COLLECT",
      "LENS_MIRROR",
      "LENS_TOTAL_FOLLOWERS",
      "LENS_TOTAL_POSTS",
      "LENS_FOLLOWED_BY",
    ],
  },
  {
    icon: "/requirementLogos/otterspace.png",
    name: "Otterspace",
    fileNameBase: "Otterspace",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Otterspace/OtterspaceRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Otterspace/OtterspaceForm")
    ),
    types: ["OTTERSPACE"],
  },
  {
    icon: "/requirementLogos/orange.png",
    name: "Orange",
    fileNameBase: "Orange",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Orange/OrangeRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Orange/OrangeForm")
    ),
    types: ["ORANGE"],
  },
  {
    icon: "/requirementLogos/cask.png",
    name: "Cask",
    fileNameBase: "Cask",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Cask/CaskRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Cask/CaskForm")
    ),
    types: ["CASK"],
  },
  // {
  //   icon: "/requirementLogos/101.png",
  //   name: "101",
  //   fileNameBase: "101",
  //   displayComponent: dynamic<RequirementProps>(
  //     () => import("requirements/101/101Requirement")
  //   ),
  //   formComponent: dynamic<RequirementFormProps>(
  //     () => import("requirements/101/101Form")
  //   ),
  //   types: ["101"],
  // },
  {
    icon: "/requirementLogos/rabbithole.png",
    name: "RabbitHole",
    fileNameBase: "Rabbithole",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Rabbithole/RabbitholeRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Rabbithole/RabbitholeForm")
    ),
    types: ["RABBITHOLE"],
  },
  {
    icon: "/requirementLogos/kycdao.svg",
    name: "kycDAO",
    fileNameBase: "KycDAO",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/KycDAO/KycDAORequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/KycDAO/KycDAOForm")
    ),
    types: ["KYC_DAO"],
  },
  {
    icon: "/requirementLogos/sismo.svg",
    name: "Sismo",
    fileNameBase: "Sismo",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Sismo/SismoRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Sismo/SismoForm")
    ),
    types: ["SISMO"],
  },
  {
    icon: "/requirementLogos/sound.png",
    name: "Sound",
    fileNameBase: "Sound",
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
  },
  {
    icon: "/networkLogos/optimism.svg",
    name: "OP Attestation",
    fileNameBase: "Optimism",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Optimism/OptimismRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Optimism/OptimismForm")
    ),
    types: ["OPTIMISM", "OPTIMISM_ATTESTATION", "OPTIMISM_PFP"],
  },
  {
    icon: "/requirementLogos/yup.svg",
    name: "Yup",
    fileNameBase: "Yup",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Yup/YupRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Yup/YupForm")
    ),
    types: ["YUP"],
  },
  {
    icon: "/requirementLogos/rep3.png",
    name: "Rep3",
    fileNameBase: "Rep3",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Rep3/Rep3Requirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Rep3/Rep3Form")
    ),
    types: ["REP3"],
  },
  {
    icon: "/explorerLogos/tessera.svg",
    name: "Tessera",
    fileNameBase: "Tessera",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Tessera/TesseraRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Tessera/TesseraForm")
    ),
    types: [
      "TESSERA",
      "TESSERA_HOLD",
      "TESSERA_HOLD_COLLECTION",
      "TESSERA_HOLD_STATE",
      "TESSERA_LISTINGS",
    ],
  },
  {
    icon: "/requirementLogos/parallel.png",
    name: "Parallel",
    fileNameBase: "Parallel",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Parallel/ParallelRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Parallel/ParallelForm")
    ),
    types: ["PARALLEL_ID", "PARALLEL_SANCTIONS_SAFE", "PARALLEL_TRAIT"],
  },
  {
    icon: "/requirementLogos/shield.png",
    name: "Shield",
    fileNameBase: "Shield",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/Shield/ShieldRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/Shield/ShieldForm")
    ),
    types: [
      "SHIELD_ANOM_TX",
      "SHIELD_UNVERIFIED_CONTRACT",
      "SHIELD_EXPLOIT_INTERACTION",
      "SHIELD_INDIRECT_DEPOSITS",
      "SHIELD_TORNADO_CASH",
    ],
  },
  {
    icon: "/requirementLogos/gitcoin-passport.svg",
    name: "Gitcoin Passport",
    fileNameBase: "GitcoinPassport",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/GitcoinPassport/GitcoinPassportRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/GitcoinPassport/GitcoinPassportForm")
    ),
    types: ["GITCOIN", "GITCOIN_PASS", "GITCOIN_STAMP", "GITCOIN_SCORE"],
  },
  {
    icon: "/requirementLogos/polygonId.svg",
    name: "PolygonID",
    fileNameBase: "PolygonID",
    displayComponent: dynamic<RequirementProps>(
      () => import("requirements/PolygonId/PolygonIdRequirement")
    ),
    formComponent: dynamic<RequirementFormProps>(
      () => import("requirements/PolygonId/PolygonIdForm")
    ),
    types: ["POLYGON_ID_QUERY", "POLYGON_ID_BASIC"],
  },
] as const

export default REQUIREMENTS_DATA
