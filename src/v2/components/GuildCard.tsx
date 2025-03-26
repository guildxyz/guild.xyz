import { Users } from "@phosphor-icons/react"
import { GuildBase } from "types"
import pluralize from "utils/pluralize"
import { CheckMark } from "./CheckMark"
import { Anchor } from "./ui/Anchor"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { Badge } from "./ui/Badge"
import { Card } from "./ui/Card"
import { Skeleton } from "./ui/Skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip"

type Props = {
  guildData: GuildBase
}

export const GuildCard: React.FC<Props> = ({ guildData }) => (
  <Card className="relative grid grid-cols-[auto,1fr] grid-rows-2 items-center gap-x-4 gap-y-1 px-6 py-7 before:absolute before:inset-0 before:bg-secondary before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] hover:before:opacity-55 active:before:opacity-85">
    <Avatar className="row-span-2 size-12">
      <AvatarImage
        src={guildData.imageUrl}
        alt={`${guildData.name} logo`}
        width={48}
        height={48}
      />
      <AvatarFallback>
        <Skeleton className="size-full" />
      </AvatarFallback>
    </Avatar>
    <div className="flex items-center">
      <h3 className="max-w-36 truncate font-bold font-display text-foreground text-lg tracking-wide">
        {guildData.name}
      </h3>
      {guildData.tags.includes("VERIFIED") && (
        <Tooltip>
          <TooltipTrigger
            className="relative px-1 pt-1"
            aria-label="verified checkmark"
          >
            <CheckMark />
          </TooltipTrigger>
          <TooltipContent>
            This guild is verified by <code>Guild.xyz</code>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    <div className="flex gap-1.5">
      <Badge className="gap-2">
        <Users weight="bold" />
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
  <Anchor href={guildData.urlName} className="rounded-2xl" variant="unstyled">
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
