import HundredNOneRequirementCard from "./components/101RequirementCard"
import AllowlistRequirementCard from "./components/AllowlistRequirementCard"
import CaskRequirementCard from "./components/CaskRequirementCard"
import ContractStateRequirementCard from "./components/ContractStateRequirementCard"
import DiscordRoleRequirementCard from "./components/DiscordRoleRequirementCard"
import DiscoRequirementCard from "./components/DiscoRequirementCard"
import FreeRequirementCard from "./components/FreeRequirementCard"
import GalaxyRequirementCard from "./components/GalaxyRequirementCard"
import GithubRequirementCard from "./components/GithubRequirementCard"
import JuiceboxRequirementCard from "./components/JuiceboxRequirementCard"
import KycDAORequirementCard from "./components/KycDAORequirementCard"
import LensRequirementCard from "./components/LensRequirementCard"
import MirrorRequirementCard from "./components/MirrorRequirementCard"
import NftRequirementCard from "./components/NftRequirementCard"
import NooxRequirementCard from "./components/NooxRequirementCard"
import OrangeRequirementCard from "./components/OrangeRequirementCard"
import OtterspaceRequirementCard from "./components/OtterspaceRequirementCard"
import PoapRequirementCard from "./components/PoapRequirementCard"
import GitPoapRequirementCard from "./components/PoapRequirementCard/GitPoapRequirementCard"
import RabbitholeRequirementCard from "./components/RabbitholeRequirementCard"
import SnapshotRequirementCard from "./components/SnapshotRequirementCard"
import TokenRequirementCard from "./components/TokenRequirementCard"
import TwitterRequirementCard from "./components/TwitterRequirementCard"
import UnlockRequirementCard from "./components/UnlockRequirementCard"

const REQUIREMENT_CARDS = {
  FREE: FreeRequirementCard,
  ERC20: TokenRequirementCard,
  COIN: TokenRequirementCard,
  ERC721: NftRequirementCard,
  ERC1155: NftRequirementCard,
  NOUNS: NftRequirementCard,
  UNLOCK: UnlockRequirementCard,
  POAP: PoapRequirementCard,
  GITPOAP: GitPoapRequirementCard,
  MIRROR: MirrorRequirementCard,
  MIRROR_COLLECT: MirrorRequirementCard,
  SNAPSHOT: SnapshotRequirementCard,
  ALLOWLIST: AllowlistRequirementCard,
  JUICEBOX: JuiceboxRequirementCard,
  GALAXY: GalaxyRequirementCard,
  TWITTER_NAME: TwitterRequirementCard,
  TWITTER_BIO: TwitterRequirementCard,
  TWITTER_FOLLOW: TwitterRequirementCard,
  TWITTER_FOLLOWER_COUNT: TwitterRequirementCard,
  GITHUB_STARRING: GithubRequirementCard,
  DISCORD_ROLE: DiscordRoleRequirementCard,
  CONTRACT: ContractStateRequirementCard,
  NOOX: NooxRequirementCard,
  DISCO: DiscoRequirementCard,
  LENS: LensRequirementCard,
  LENS_PROFILE: LensRequirementCard,
  LENS_FOLLOW: LensRequirementCard,
  LENS_COLLECT: LensRequirementCard,
  LENS_MIRROR: LensRequirementCard,
  OTTERSPACE: OtterspaceRequirementCard,
  ORANGE: OrangeRequirementCard,
  CASK: CaskRequirementCard,
  "101": HundredNOneRequirementCard,
  RABBITHOLE: RabbitholeRequirementCard,
  KYC_DAO: KycDAORequirementCard,
}

export default REQUIREMENT_CARDS
