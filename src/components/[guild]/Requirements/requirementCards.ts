import AllowlistRequirementCard from "./components/AllowlistRequirementCard"
import ContractStateRequirementCard from "./components/ContractStateRequirementCard"
import DiscordRoleRequirementCard from "./components/DiscordRoleRequirementCard"
import DiscoRequirementCard from "./components/DiscoRequirementCard"
import FreeRequirementCard from "./components/FreeRequirementCard"
import GalaxyRequirementCard from "./components/GalaxyRequirementCard"
import GithubRequirementCard from "./components/GithubRequirementCard"
import JuiceboxRequirementCard from "./components/JuiceboxRequirementCard"
import LensRequirementCard from "./components/LensRequirementCard"
import MirrorRequirementCard from "./components/MirrorRequirementCard"
import NftRequirementCard from "./components/NftRequirementCard"
import NooxRequirementCard from "./components/NooxRequirementCard"
import OrangeRequirementCard from "./components/OrangeRequirementCard"
import OtterspaceRequirementCard from "./components/OtterspaceRequirementCard"
import PoapRequirementCard from "./components/PoapRequirementCard"
import GitPoapRequirementCard from "./components/PoapRequirementCard/GitPoapRequirementCard"
import SnapshotRequirementCard from "./components/SnapshotRequirementCard"
import TokenRequirementCard from "./components/TokenRequirementCard"
import TwitterBioRequirementCard from "./components/TwitterBioRequirementCard"
import TwitterFollowerCountRequirementCard from "./components/TwitterFollowerCountRequirementCard"
import TwitterFollowRequirementCard from "./components/TwitterFollowRequirementCard"
import TwitterNameRequirementCard from "./components/TwitterNameRequirementCard"
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
  SNAPSHOT: SnapshotRequirementCard,
  ALLOWLIST: AllowlistRequirementCard,
  JUICEBOX: JuiceboxRequirementCard,
  GALAXY: GalaxyRequirementCard,
  TWITTER_NAME: TwitterNameRequirementCard,
  TWITTER_BIO: TwitterBioRequirementCard,
  TWITTER_FOLLOW: TwitterFollowRequirementCard,
  TWITTER_FOLLOWER_COUNT: TwitterFollowerCountRequirementCard,
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
}

export default REQUIREMENT_CARDS
