import { GuildReward, Schemas } from "@guildxyz/types"

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
  const { NFTs, pins, points: collectionPoints } = collection
  console.log({ NFTs, pins, collectionPoints })
  // const collections = [...NFTs, ...pins, ...collectionPoints]
  // const collectionPoint = collectionPoints.at(0)
  // const collectionNft = collection.NFTs.at(0)
  // const collectionPin = collection.pins.at(0)

  // const points = useSWRImmutable<Schemas["ContributionCollection"]["points"]>(
  //   collection.data?.points
  //     ? collection.data.points.map(
  //       ({ guildId, guildPlatformId }) =>
  //         `/v2/guilds/${guildId}/guild-platforms/${guildPlatformId}`
  //     )
  //     : null,
  //   (args) => Promise.all(args.map((arg) => fetcher(arg)))
  // )

  // collection.data.points = collection.data.points.map((rawPoints, i) => ({
  //   ...rawPoints,
  //   point: points.data?.at(i),
  // }))

  return (
    <>
      {/*collectionNft && (
                <Avatar
                  className={cn(avatarVariants({ size: "lg" }), "-ml-3 border")}
                >
                  <AvatarImage
                    src={collectionNft.}
                    alt="avatar"
                  />
                  <AvatarFallback />
                </Avatar>)
              */}
      {/*collectionPoint?.point && (
        <>
          <Avatar className={cn(avatarVariants({ size: "lg" }), "-ml-3 border")}>
            <AvatarImage
              src={collectionPoint.point.platformGuildData.imageUrl}
              alt="avatar"
            />
            <AvatarFallback />
          </Avatar>
          <div className="-ml-3 self-center rounded-r-lg border bg-card-secondary pl-5 pr-2 py-0.5">
            <div className="text-sm">
              {collectionPoint.totalPoints}&nbsp;
              <span className="font-extrabold">
                {collectionPoint.point.platformGuildData.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Users weight="bold" />
              {Number((collectionPoint.rank / 500000) * 100)}%
            </div>
          </div>
        </>
      )*/}
    </>
  )
}
