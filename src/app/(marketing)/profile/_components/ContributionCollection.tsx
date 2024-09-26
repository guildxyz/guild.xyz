import { Anchor } from "@/components/ui/Anchor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard"
import { Guild, GuildReward, Schemas } from "@guildxyz/types"
import { Ranking } from "@phosphor-icons/react"
import { GuildAction } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import { env } from "env"
import Image from "next/image"
import Star from "static/icons/star.svg"
import useSWRImmutable from "swr/immutable"
import shortenHex from "utils/shortenHex"

export const ContributionCollection = ({
  collection,
  guild,
}: { collection: Schemas["ContributionCollection"]; guild: Guild }) => {
  const collectionPoint = collection.points.at(0)
  const collectionNft = collection.NFTs.at(0)
  const collectionPin = collection.pins.at(0)
  const { data: pinHash } = useSWRImmutable<string>(
    collectionPin
      ? `/v2/guilds/${guild.id}/pin?guildAction=${GuildAction[collectionPin.action]}`
      : null
  )
  const pin = pinHash ? new URL(pinHash, env.NEXT_PUBLIC_IPFS_GATEWAY) : undefined
  const { data: point } = useSWRImmutable<GuildReward>(
    collectionPoint
      ? `/v2/guilds/${collectionPoint.guildId}/guild-platforms/${collectionPoint.guildPlatformId}`
      : null
  )

  return (
    <>
      {pin && (
        <HoverCard openDelay={100}>
          <HoverCardTrigger>
            <Avatar size="lg" className="-ml-3 border-2 border-card">
              <AvatarImage src={pin.href} alt="guild pin" width={32} height={32} />
              <AvatarFallback />
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="overflow-hidden bg-card-secondary p-0">
            <div className="relative grid size-64 place-items-center overflow-hidden bg-background">
              <Image
                src={pin.href}
                className="absolute size-full translate-y-1/2 rotate-180 scale-x-90 scale-y-125 blur-3xl saturate-150"
                alt="guild pin"
                width={32}
                height={32}
              />
              <Avatar
                size="lg"
                className="mt-2.5 size-48 animate-float border"
                style={{ animationDuration: "4s" }}
              >
                <AvatarImage
                  src={pin.href}
                  alt="guild pin"
                  width={192}
                  height={192}
                />
                <AvatarFallback />
              </Avatar>
            </div>
            <article className="border-t p-3">
              <div className="space-x-1">
                <Badge size="sm">Guild Pin</Badge>
              </div>
              <h3 className="my-2 inline-block font-bold">
                Minted <span className="font-display">{guild.name}</span> pin
              </h3>
            </article>
          </HoverCardContent>
        </HoverCard>
      )}
      {collectionNft?.data.imageUrl && (
        <HoverCard openDelay={100}>
          <HoverCardTrigger>
            <Avatar size="lg" className="-ml-3 border-2 border-card">
              <AvatarImage
                src={collectionNft.data.imageUrl}
                alt={collectionNft.data.name || "nft"}
                width={256}
                height={256}
              />
              <AvatarFallback />
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="overflow-hidden bg-card-secondary p-0">
            <Image
              src={collectionNft.data.imageUrl}
              alt={collectionNft.data.name || "nft"}
              width={256}
              height={256}
            />
            <article className="border-t p-3">
              <div className="space-x-1">
                <Badge size="sm">NFT</Badge>
                <Badge size="sm" variant="outline">
                  {shortenHex(collectionNft.data.contractAddress)}
                </Badge>
              </div>
              <h3 className="my-2 inline-block font-bold">
                <Anchor
                  href={`/${guild.urlName}/collect/${collectionNft.data.chain}/${collectionNft.data.contractAddress}`}
                  target="_blank"
                >
                  {collectionNft.data.name}
                </Anchor>
              </h3>
              <p className="text-muted-foreground text-sm leading-normal">
                {collectionNft.data.description}
              </p>
            </article>
          </HoverCardContent>
        </HoverCard>
      )}
      {point && collectionPoint && (
        <>
          <Avatar size="lg" className="-ml-3 border-2 border-card">
            {point.platformGuildData.imageUrl ? (
              <>
                <AvatarImage
                  src={point.platformGuildData.imageUrl}
                  alt="avatar"
                  width={32}
                  height={32}
                />
                <AvatarFallback />
              </>
            ) : (
              <Star className="size-6" />
            )}
          </Avatar>
          <div className="-ml-3 self-center whitespace-nowrap rounded-r-lg border bg-card-secondary py-0.5 pr-2 pl-5">
            <div className="text-sm">
              {collectionPoint.totalPoints}&nbsp;
              <span className="font-extrabold">{point.platformGuildData.name}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Ranking weight="bold" />#{collectionPoint.rank}
            </div>
          </div>
        </>
      )}
    </>
  )
}
