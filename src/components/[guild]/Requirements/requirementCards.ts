import HundredNOneRequirementCard from "./components/101RequirementCard"
import AllowlistRequirementCard from "./components/AllowlistRequirementCard"
import CaskRequirementCard from "./components/CaskRequirementCard"
import ContractStateRequirementCard from "./components/ContractStateRequirementCard"
import DiscordJoinFromNowRequirementCard from "./components/DiscordJoinFromNowRequirementCard"
import DiscordJoinRequirementCard from "./components/DiscordJoinRequirementCard"
import DiscordMemberSinceRequirementCard from "./components/DiscordMemberSinceRequirementCard"
import DiscordRoleRequirementCard from "./components/DiscordRoleRequirementCard"
import DiscoRequirementCard from "./components/DiscoRequirementCard"
import FreeRequirementCard from "./components/FreeRequirementCard"
import GalaxyRequirementCard from "./components/GalaxyRequirementCard"
import GithubRequirementCard from "./components/GithubRequirementCard"
import GuildAdminRequirementCard from "./components/GuildAdminRequirementCard"
import GuildMinGuildsRequirementCard from "./components/GuildMinGuildsRequirementCard"
import GuildRoleRequirementCard from "./components/GuildRoleRequirementCard"
import GuildUserSinceRequirementCard from "./components/GuildUserSinceRequirementCard"
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
import SoundRequirementCard from "./components/SoundRequirementCard"
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
  MIRROR_COLLECT: MirrorRequirementCard,
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
  DISCORD_MEMBER_SINCE: DiscordMemberSinceRequirementCard,
  DISCORD_JOIN: DiscordJoinRequirementCard,
  DISCORD_JOIN_FROM_NOW: DiscordJoinFromNowRequirementCard,
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
  GUILD_ROLE: GuildRoleRequirementCard,
  GUILD_ADMIN: GuildAdminRequirementCard,
  GUILD_USER_SINCE: GuildUserSinceRequirementCard,
  GUILD_MINGUILDS: GuildMinGuildsRequirementCard,
  SOUND: SoundRequirementCard,
  SOUND_COLLECTED: SoundRequirementCard,
  SOUND_ARTIST_BACKED: SoundRequirementCard,
  SOUND_ARTIST: SoundRequirementCard,
  SOUND_TOP_COLLECTOR: SoundRequirementCard,
}

export default REQUIREMENT_CARDS
