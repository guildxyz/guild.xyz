import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  avatarVariants,
} from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"
import { GuildReward, Schemas } from "@guildxyz/types"
import { Users } from "@phosphor-icons/react"
import useSWRImmutable from "swr/immutable"

// export type Point = {
//   id: number
//   platformId: number
//   platformGuildId: string
//   platformGuildData: {
//     name: string
//     imageUrl: string
//   }
// }

type ExtendedCollection = Schemas["ContributionCollection"] & {
  // TODO: move this override type to backend
  points: (Schemas["ContributionCollection"]["points"][number] & {
    point: GuildReward
  })[]
}

export const ContributionCollection = ({
  collection,
}: { collection: Schemas["ContributionCollection"] }) => {
  const { NFTs, pins, points } = collection
  console.log({ NFTs, pins, points })
  const collectionPoint = points.at(0)
  const collectionNft = collection.NFTs.at(0)
  const collectionPin = collection.pins.at(0)

  const { data: point } = useSWRImmutable<GuildReward>(
    collectionPoint?.guildId
      ? `/v2/guilds/${collectionPoint.guildId}/guild-platforms/${collectionPoint.guildPlatformId}`
      : null
  )

  return (
    <>
      {collectionNft?.data.imageUrl && (
        <Avatar className={cn(avatarVariants({ size: "lg" }), "-ml-3 border")}>
          <AvatarImage
            src={collectionNft.data.imageUrl}
            alt="avatar"
            width={32}
            height={32}
          />
          <AvatarFallback />
        </Avatar>
      )}
      {point && collectionPoint && point.platformGuildData.imageUrl && (
        <>
          <Avatar className={cn(avatarVariants({ size: "lg" }), "-ml-3 border")}>
            <AvatarImage
              src={point.platformGuildData.imageUrl}
              alt="avatar"
              width={32}
              height={32}
            />
            <AvatarFallback />
          </Avatar>
          <div className="-ml-3 self-center rounded-r-lg border bg-card-secondary py-0.5 pr-2 pl-5">
            <div className="text-sm">
              {collectionPoint.totalPoints}&nbsp;
              <span className="font-extrabold">{point.platformGuildData.name}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Users weight="bold" />
              {
                // TODO: use leaderboard rank size
                Number(((collectionPoint.rank / 500000) * 100).toFixed(2))
              }
              %
            </div>
          </div>
        </>
      )}
    </>
  )
}
