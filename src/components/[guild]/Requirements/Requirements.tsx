import { Box, Collapse, Spinner, useColorModeValue, VStack } from "@chakra-ui/react"
import React, { useState } from "react"
import { Logic, Requirement, RequirementType } from "types"
import LogicDivider from "../LogicDivider"
import HundredNOneRequirementCard from "./components/101RequirementCard"
import AllowlistRequirementCard from "./components/AllowlistRequirementCard"
import ContractStateRequirementCard from "./components/ContractStateRequirementCard"
import DiscordRoleRequirementCard from "./components/DiscordRoleRequirementCard"
import DiscoRequirementCard from "./components/DiscoRequirementCard"
import ExpandRequirementsButton from "./components/ExpandRequirementsButton"
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
import SpotifyTopArtistsRequirementCard from "./components/Spotify/SoptifyTopArtistsRequirementCard"
import SpotifyTopTracksRequirementCard from "./components/Spotify/SoptifyTopTracksRequirementCard"
import SpotifyAddEpisodeToLibraryRequirementCard from "./components/Spotify/SpotifyAddEpisodeToLibraryRequirementCard"
import SpotifyFollowArtistRequirementCard from "./components/Spotify/SpotifyFollowArtistRequirementCard"
import SpotifyFollowerCountRequirementCard from "./components/Spotify/SpotifyFollowerCountRequirementCard"
import SpotifyFollowPlaylistRequirementCard from "./components/Spotify/SpotifyFollowPlaylistRequirementCard"
import SpotifyFollowPodcastRequirementCard from "./components/Spotify/SpotifyFollowPodcastRequirementCard"
import SpotifyFollowUserRequirementCard from "./components/Spotify/SpotifyFollowUserRequirementCard"
import SpotifyLikeAlbumRequirementCard from "./components/Spotify/SpotifyLikeAlbumRequirementCard"
import SpotifyLikeTrackRequirementCard from "./components/Spotify/SpotifyLikeTrackRequirementCard"
import SpotifyNameRequirementCard from "./components/Spotify/SpotifyNameRequirementCard"
import TokenRequirementCard from "./components/TokenRequirementCard"
import TwitterBioRequirementCard from "./components/TwitterBioRequirementCard"
import TwitterFollowerCountRequirementCard from "./components/TwitterFollowerCountRequirementCard"
import TwitterFollowRequirementCard from "./components/TwitterFollowRequirementCard"
import TwitterNameRequirementCard from "./components/TwitterNameRequirementCard"
import UnlockRequirementCard from "./components/UnlockRequirementCard"

const REQUIREMENT_CARDS: Partial<
  Record<RequirementType, (props: { requirement: Requirement }) => JSX.Element>
> = {
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
  "101": HundredNOneRequirementCard,
  RABBITHOLE: RabbitholeRequirementCard,
  KYC_DAO: KycDAORequirementCard,
  SPOTIFY_FOLLOW: SpotifyFollowArtistRequirementCard,
  SPOTIFY_FOLLOW_USER: SpotifyFollowUserRequirementCard,
  SPOTIFY_FOLLOW_PLAYLIST: SpotifyFollowPlaylistRequirementCard,
  SPOTIFY_NAME: SpotifyNameRequirementCard,
  SPOTIFY_FOLLOWER_COUNT: SpotifyFollowerCountRequirementCard,
  SPOTIFY_SAVED_ALBUM: SpotifyLikeAlbumRequirementCard,
  SPOTIFY_SAVED_EPISODE: SpotifyAddEpisodeToLibraryRequirementCard,
  SPOTIFY_SAVED_SHOW: SpotifyFollowPodcastRequirementCard,
  SPOTIFY_SAVED_TRACK: SpotifyLikeTrackRequirementCard,
  SPOTIFY_TOP_TRACKS: SpotifyTopTracksRequirementCard,
  SPOTIFY_TOP_ARTISTS: SpotifyTopArtistsRequirementCard,
}

type Props = {
  requirements: Requirement[]
  logic: Logic
}

const Requirements = ({ requirements, logic }: Props) => {
  const sliceIndex = (requirements?.length ?? 0) - 3
  const shownRequirements = (requirements ?? []).slice(0, 3)
  const hiddenRequirements =
    sliceIndex > 0 ? (requirements ?? []).slice(-sliceIndex) : []

  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false)
  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-900)"
  )

  return (
    <VStack spacing="0">
      {!requirements?.length ? (
        <Spinner />
      ) : (
        shownRequirements.map((requirement, i) => {
          const RequirementCard = REQUIREMENT_CARDS[requirement.type]

          if (RequirementCard)
            return (
              <React.Fragment key={i}>
                <RequirementCard requirement={requirement} />
                {i < shownRequirements.length - 1 && <LogicDivider logic={logic} />}
              </React.Fragment>
            )
        })
      )}

      <Collapse
        in={isRequirementsExpanded}
        animateOpacity={false}
        style={{ width: "100%" }}
      >
        {hiddenRequirements.map((requirement, i) => {
          const RequirementCard = REQUIREMENT_CARDS[requirement.type]
          if (RequirementCard)
            return (
              <React.Fragment key={i}>
                {i === 0 && <LogicDivider logic={logic} />}
                <RequirementCard requirement={requirement} />
                {i < hiddenRequirements.length - 1 && <LogicDivider logic={logic} />}
              </React.Fragment>
            )
        })}
      </Collapse>

      {hiddenRequirements.length > 0 && (
        <>
          <ExpandRequirementsButton
            logic={logic}
            hiddenRequirements={hiddenRequirements.length}
            isRequirementsExpanded={isRequirementsExpanded}
            setIsRequirementsExpanded={setIsRequirementsExpanded}
          />
          <Box
            position="absolute"
            bottom={{ base: 8, md: 0 }}
            left={0}
            right={0}
            height={6}
            bgGradient={`linear-gradient(to top, ${shadowColor}, transparent)`}
            pointerEvents="none"
            opacity={isRequirementsExpanded ? 0 : 0.6}
            transition="opacity 0.2s ease"
          />
        </>
      )}
    </VStack>
  )
}

export default Requirements
