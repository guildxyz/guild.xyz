import HundredNOneFormCard from "./components/101FormCard/101FormCard"
import AllowlistFormCard from "./components/AllowlistFormCard"
import CaskFormCard from "./components/CaskFormCard"
import ContractStateFormCard from "./components/ContractStateFormCard/ContractStateFormCard"
import DiscoFormCard from "./components/DiscoFormCard"
import DiscordFormCard from "./components/DiscordFormCard"
import GalaxyFormCard from "./components/GalaxyFormCard"
import GithubFormCard from "./components/GithubFormCard"
import GitPoapFormCard from "./components/GitPoapFormCard"
import GuildFormCard from "./components/GuildFormCard"
import JuiceboxFormCard from "./components/JuiceboxFormCard"
import KycDAOFormCard from "./components/KycDAOFormCard"
import LensFormCard from "./components/LensFormCard"
import MirrorFormCard from "./components/MirrorFormCard"
import MirrorV2FormCard from "./components/MirrorV2FormCard"
import NftFormCard from "./components/NftFormCard"
import NooxFormCard from "./components/NooxFormCard"
import OrangeFormCard from "./components/OrangeFormCard"
import OtterspaceFormCard from "./components/OtterspaceFormCard"
import PoapFormCard from "./components/PoapFormCard"
import RabbitholeFormCard from "./components/RabbitholeFormCard"
import SnapshotFormCard from "./components/SnapshotFormCard"
import TokenFormCard from "./components/TokenFormCard"
import TwitterFormCard from "./components/TwitterFormCard"
import UnlockFormCard from "./components/UnlockFormCard"

const REQUIREMENT_FORMCARDS = {
  ERC20: TokenFormCard,
  COIN: TokenFormCard,
  CONTRACT: ContractStateFormCard,
  POAP: PoapFormCard,
  GITPOAP: GitPoapFormCard,
  MIRROR: MirrorFormCard,
  MIRROR_COLLECT: MirrorV2FormCard,
  SNAPSHOT: SnapshotFormCard,
  ALLOWLIST: AllowlistFormCard,
  ERC721: NftFormCard,
  ERC1155: NftFormCard,
  NOUNS: NftFormCard,
  JUICEBOX: JuiceboxFormCard,
  UNLOCK: UnlockFormCard,
  GALAXY: GalaxyFormCard,
  TWITTER: TwitterFormCard,
  TWITTER_FOLLOW: TwitterFormCard,
  TWITTER_NAME: TwitterFormCard,
  TWITTER_FOLLOWER_COUNT: TwitterFormCard,
  TWITTER_BIO: TwitterFormCard,
  GITHUB: GithubFormCard,
  GITHUB_STARRING: GithubFormCard,
  DISCORD: DiscordFormCard,
  DISCORD_ROLE: DiscordFormCard,
  DISCORD_MEMBER_SINCE: DiscordFormCard,
  DISCORD_JOIN: DiscordFormCard,
  DISCORD_JOIN_FROM_NOW: DiscordFormCard,
  NOOX: NooxFormCard,
  DISCO: DiscoFormCard,
  LENS_PROFILE: LensFormCard,
  LENS_FOLLOW: LensFormCard,
  LENS_COLLECT: LensFormCard,
  LENS_MIRROR: LensFormCard,
  OTTERSPACE: OtterspaceFormCard,
  ORANGE: OrangeFormCard,
  CASK: CaskFormCard,
  101: HundredNOneFormCard,
  RABBITHOLE: RabbitholeFormCard,
  KYC_DAO: KycDAOFormCard,
  GUILD: GuildFormCard,
  GUILD_ROLE: GuildFormCard,
  GUILD_ADMIN: GuildFormCard,
  GUILD_USER_SINCE: GuildFormCard,
  GUILD_MINGUILDS: GuildFormCard,
}

const getRequirementLabel = (type) => {
  switch (type) {
    case "ERC1155":
    case "ERC721":
    case "NOUNS":
      return "NFT"

    case "CONTRACT":
      return "CONTRACT STATE"

    case "TWITTER_FOLLOW":
    case "TWITTER_BIO":
    case "TWITTER_NAME":
    case "TWITTER_FOLLOWER_COUNT":
      return "TWITTER"

    case "GITHUB_STARRING":
      return "GITHUB"

    case "GALAXY":
      return "GALXE"

    case "DISCORD_ROLE":
    case "DISCORD_MEMBER_SINCE":
    case "DISCORD_JOIN":
    case "DISCORD_JOIN_FROM_NOW":
      return "DISCORD"

    case "LENS_PROFILE":
    case "LENS_FOLLOW":
    case "LENS_COLLECT":
    case "LENS_MIRROR":
      return "LENS"

    case "MIRROR_COLLECT":
      return "MIRROR"

    case "KYC_DAO":
      return "KYCDAO"

    default:
      return type
  }
}

export default REQUIREMENT_FORMCARDS
export { getRequirementLabel }
