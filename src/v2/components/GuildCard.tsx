import { CircleWavyCheck, Users } from "@phosphor-icons/react"
import { GuildBase } from "types"
import pluralize from "utils/pluralize"
import { GuildLogo } from "./GuildLogo"
import { Anchor } from "./ui/Anchor"
import { Badge } from "./ui/Badge"
import { Card } from "./ui/Card"
import { Skeleton } from "./ui/Skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Tooltip"

type Props = {
  guildData: GuildBase
}

export const GuildCard: React.FC<Props> = ({ guildData }) => (
  <Card className="relative grid grid-cols-[auto,1fr] grid-rows-2 items-center gap-x-4 gap-y-1 px-6 py-7 before:absolute before:inset-0 before:bg-secondary before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] hover:before:opacity-55 active:before:opacity-85">
    <GuildLogo imageUrl={guildData.imageUrl} className="row-span-2" />
    <div className="flex items-center">
      <h3 className="max-w-36 truncate font-bold font-display text-foreground text-lg tracking-wide">
        {guildData.name}
      </h3>
      {guildData.tags.includes("VERIFIED") && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="relative rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="verified"
            >
              <div
                className="absolute inset-2 rounded-full bg-white"
                aria-hidden="true"
              />
              <CircleWavyCheck
                weight="fill"
                className="relative size-5 fill-blue-500"
              />
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
