// TODO: mirror formcards, github

import {
  CurrencyCircleDollar,
  ImageSquare,
  ListChecks,
  Wallet,
  Wrench,
} from "phosphor-react"

const REQUIREMENTS_ARRAY = [
  {
    icon: Wallet,
    name: "Free",
    fileNameBase: "Free",
    types: ["FREE"],
  },
  {
    icon: CurrencyCircleDollar,
    name: "Token",
    fileNameBase: "Token",
    types: ["ERC20", "COIN"],
  },
  {
    icon: ImageSquare,
    name: "NFT",
    fileNameBase: "Nft",
    types: ["ERC721", "ERC1155", "NOUNS"],
  },
  {
    icon: ListChecks,
    name: "Allowlist",
    fileNameBase: "Allowlist",
    types: ["ALLOWLIST"],
  },
  {
    icon: Wrench,
    name: "Custom contract query",
    fileNameBase: "ContractState",
    types: ["CONTRACT"],
  },
  {
    icon: "/requirementLogos/twitter.svg",
    name: "Twitter",
    fileNameBase: "Twitter",
    types: [
      "TWITTER",
      "TWITTER_NAME",
      "TWITTER_BIO",
      "TWITTER_FOLLOW",
      "TWITTER_FOLLOWER_COUNT",
    ],
  },
  {
    icon: "/platforms/github.png",
    name: "GitHub",
    fileNameBase: "Github",
    types: ["GITHUB", "GITHUB_STARRING"],
  },
  {
    icon: "/platforms/discord.png",
    name: "Discord",
    fileNameBase: "Discord",
    types: ["DISCORD", "DISCORD_ROLE"],
  },
  {
    icon: "/requirementLogos/unlock.png",
    name: "Unlock",
    fileNameBase: "Unlock",
    types: ["UNLOCK"],
  },
  {
    icon: "/requirementLogos/poap.svg",
    name: "Poap",
    fileNameBase: "Poap",
    types: ["POAP"],
  },
  {
    icon: "/requirementLogos/gitpoap.svg",
    name: "GitPOAP",
    fileNameBase: "GitPoap",
    types: ["GITPOAP"],
  },
  {
    icon: "/requirementLogos/mirror.svg",
    name: "Mirror",
    fileNameBase: "Mirror",
    types: ["MIRROR", "MIRROR_COLLECT"],
  },
  {
    icon: "/requirementLogos/snapshot.png",
    name: "Snapshot",
    fileNameBase: "Snapshot",
    types: ["SNAPSHOT"],
    disabled: true,
  },
  {
    icon: "/requirementLogos/juicebox.png",
    name: "Juicebox",
    fileNameBase: "Juicebox",
    types: ["JUICEBOX"],
  },
  {
    icon: "/requirementLogos/galaxy.svg",
    name: "Galxe",
    fileNameBase: "Galaxy",
    types: ["GALAXY"],
  },
  {
    icon: "/requirementLogos/noox.svg",
    name: "Noox",
    fileNameBase: "Noox",
    types: ["NOOX"],
  },
  {
    icon: "/requirementLogos/disco.png",
    name: "Disco",
    fileNameBase: "Disco",
    types: ["DISCO"],
  },
  {
    icon: "/requirementLogos/lens.png",
    name: "Lens",
    fileNameBase: "Lens",
    types: ["LENS", "LENS_PROFILE", "LENS_FOLLOW", "LENS_COLLECT", "LENS_MIRROR"],
  },
  {
    icon: "/requirementLogos/otterspace.png",
    name: "Otterspace",
    fileNameBase: "Otterspace",
    types: ["OTTERSPACE"],
  },
  {
    icon: "/requirementLogos/orange.png",
    name: "Orange",
    fileNameBase: "Orange",
    types: ["ORANGE"],
  },
  {
    icon: "/requirementLogos/cask.png",
    name: "Cask",
    fileNameBase: "Cask",
    types: ["CASK"],
  },
  {
    icon: "/requirementLogos/101.png",
    name: "101",
    fileNameBase: "101",
    types: ["101"],
  },
  {
    icon: "/requirementLogos/rabbithole.png",
    name: "Rabbithole",
    fileNameBase: "Rabbithole",
    types: ["RABBITHOLE"],
  },
  {
    icon: "/requirementLogos/kycdao.svg",
    name: "kycDAO",
    fileNameBase: "Kyc",
    types: ["KYC_DAO"],
  },
]

// transform it to an object with types as keys so we don't have to use .find() every time
const REQUIREMENTS = REQUIREMENTS_ARRAY.reduce(
  (acc, curr) => (curr.types.map((type) => (acc[type] = curr)), acc),
  {}
)

export default REQUIREMENTS
