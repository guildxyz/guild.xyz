import { Users, CircleWavyCheck } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { Badge } from "./ui/Badge"
import { GuildBase } from "types"
import pluralize from "utils/pluralize"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Tooltip"
import { Skeleton } from "./ui/Skeleton"
import { Card } from "./ui/Card"
import Image from "next/image"
import { Anchor } from "./ui/Anchor"

type Props = {
  guildData: GuildBase
}

export const GuildCard: React.FC<Props> = ({ guildData }) => (
  <Card className="-z-10 grid grid-cols-[auto,1fr] grid-rows-2 items-center gap-x-4 gap-y-1 px-6 py-7">
    <Avatar className="row-span-2 size-12">
      <AvatarImage src={guildData.imageUrl} className="bg-black/50" asChild>
        <Image height={40} width={40} src={guildData.imageUrl} alt="guild emblem" />
      </AvatarImage>
      <AvatarFallback className="bg-transparent">
        <Skeleton className="size-full" />
      </AvatarFallback>
    </Avatar>
    <div className="flex items-center gap-1">
      <h3 className="max-w-36 truncate font-display text-lg font-bold tracking-tight text-foreground">
        {guildData.name}
      </h3>
      {guildData.tags.includes("VERIFIED") && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="verified"
            >
              <div
                className="absolute inset-1 rounded-full bg-white"
                aria-hidden="true"
              />
              <CircleWavyCheck weight="fill" className="relative fill-blue-500" />
            </TooltipTrigger>
            <TooltipContent>
              This guild is verified by <code>Guild.xyz</code>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <div className="flex gap-2">
      <Badge className="space-x-2">
        <Users />
        <span>
          {new Intl.NumberFormat("en", { notation: "compact" }).format(
            guildData.memberCount
          )}
        </span>
      </Badge>
      <Badge>{pluralize(guildData.rolesCount, "role")}</Badge>
    </div>
  </Card>
)

export const GuildCardWithLink: typeof GuildCard = ({ guildData }) => (
  <Anchor href={guildData.urlName} className="rounded-2xl" variant="silent">
    <GuildCard guildData={guildData} />
  </Anchor>
)

export const GuildCardSkeleton = () => (
  <Card className="-z-10 grid grid-cols-[auto,1fr] grid-rows-2 items-center gap-x-4 gap-y-1 px-6 py-7">
    <Skeleton className="row-span-2 size-12 rounded-full" />
    <Skeleton className="h-7 w-36" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-12" />
    </div>
  </Card>
)
