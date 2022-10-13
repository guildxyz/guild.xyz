import AllowlistFormCard from "./components/AllowlistFormCard"
import ContractStateFormCard from "./components/ContractStateFormCard/ContractStateFormCard"
import DiscoFormCard from "./components/DiscoFormCard"
import GalaxyFormCard from "./components/GalaxyFormCard"
import GithubFormCard from "./components/GithubFormCard"
import GitPoapFormCard from "./components/GitPoapFormCard"
import JuiceboxFormCard from "./components/JuiceboxFormCard"
import LensFormCard from "./components/LensFormCard"
import MirrorFormCard from "./components/MirrorFormCard"
import NftFormCard from "./components/NftFormCard"
import NooxFormCard from "./components/NooxFormCard"
import OtterspaceFormCard from "./components/OtterspaceFormCard"
import PoapFormCard from "./components/PoapFormCard"
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
  NOOX: NooxFormCard,
  LENS_PROFILE: LensFormCard,
  LENS_FOLLOW: LensFormCard,
  LENS_COLLECT: LensFormCard,
  LENS_MIRROR: LensFormCard,
  OTTERSPACE: OtterspaceFormCard,
  DISCO: DiscoFormCard,
}

export default REQUIREMENT_FORMCARDS
