import { Schemas } from "@guildxyz/types"
import dynamic from "next/dynamic"
import { ComponentType } from "react"
import { Requirement } from "types"

export type ProvidedValueDisplayProps = {
  requirement: Partial<Requirement>
}

export const REQUIREMENT_PROVIDED_VALUES: Partial<
  Record<Schemas["Requirement"]["type"], ComponentType<ProvidedValueDisplayProps>>
> = {
  ERC20: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Token/providedValue/TokenProvidedValue")
  ),
  COIN: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Token/providedValue/TokenProvidedValue")
  ),
  GUILD_SNAPSHOT: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Airdrop/providedValue/AirdropProvidedValue")
  ),
  UNISWAP_V3_POSITIONS: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Uniswap/providedValue/PositionsProvidedValue")
  ),

  // NFTs
  ERC721: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Nft/providedValue/NftAmountProvidedValue")
  ),
  ERC1155: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Nft/providedValue/NftAmountProvidedValue")
  ),
  NOUNS: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Nft/providedValue/NftAmountProvidedValue")
  ),

  GUILD_MINGUILDS: () => "Guild membership count",

  COVALENT_TX_COUNT: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/WalletActivity/providedValue/TxCountProvidedValue")
  ),
  COVALENT_TX_COUNT_RELATIVE: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/WalletActivity/providedValue/TxCountProvidedValue")
  ),
  COVALENT_CONTRACT_DEPLOY: dynamic<ProvidedValueDisplayProps>(
    () =>
      import("requirements/WalletActivity/providedValue/ContractDeployProvidedValue")
  ),
  COVALENT_CONTRACT_DEPLOY_RELATIVE: dynamic<ProvidedValueDisplayProps>(
    () =>
      import("requirements/WalletActivity/providedValue/ContractDeployProvidedValue")
  ),

  POINTS_AMOUNT: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Points/providedValue/PointsAmountProvidedValue")
  ),
  POINTS_TOTAL_AMOUNT: () => "Total score summing all points",
  POINTS_RANK: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Points/providedValue/PointsRankProvidedValue")
  ),

  TWITTER_FOLLOWER_COUNT: () => "Followers on X",

  FARCASTER_TOTAL_FOLLOWERS: () => "Followers on Farcaster",

  LENS_TOTAL_FOLLOWERS: () => "Followers on Lens Protocol",
  LENS_TOTAL_POSTS: () => "Number of posts",

  GITCOIN_SCORE: dynamic<ProvidedValueDisplayProps>(
    () =>
      import("requirements/GitcoinPassport/providedValue/GitcoinScoreProvidedValue")
  ),

  SNAPSHOT_VOTES: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Snapshot/providedValue/VotesProvidedValue")
  ),
  SNAPSHOT_PROPOSALS: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Snapshot/providedValue/ProposalsProvidedValue")
  ),

  SOUND_TOP_COLLECTOR: dynamic<ProvidedValueDisplayProps>(
    () => import("requirements/Sound/providedValue/TopCollectorProvidedValue")
  ),
  SOUND_NFTS: () => "Songs owned",
}

export const PROVIDER_TYPES = Object.keys(REQUIREMENT_PROVIDED_VALUES) as Array<
  keyof typeof REQUIREMENT_PROVIDED_VALUES
>
