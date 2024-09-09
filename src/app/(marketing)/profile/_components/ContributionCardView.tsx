import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"
import { Guild, Role, Schemas } from "@guildxyz/types"
import { Users } from "@phosphor-icons/react/dist/ssr"
import { CardWithGuildLabel } from "./CardWithGuildLabel"
import { ContributionCollection } from "./ContributionCollection"

export const ContributionCardView = ({
  guild,
  role,
  collection,
}: {
  guild: Guild
  role: Role
  collection?: Schemas["ContributionCollection"]
}) => {
  const roleAcquirementPercentage = Number(
    ((role.memberCount / guild.memberCount || 0) * 100).toFixed(1)
  )
  const collections = [collection?.NFTs, collection?.pins, collection?.points]
    .filter(Boolean)
    .flat()
  return (
    <CardWithGuildLabel guild={guild}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4 p-5 md:grid-cols-[auto_auto_1fr] md:p-6">
        <Avatar className="size-16 md:size-20">
          <AvatarImage src={role.imageUrl} alt={"role"} width={64} height={64} />
          <AvatarFallback />
        </Avatar>
        <div>
          <div className="font-extrabold text-muted-foreground text-xs uppercase">
            TOP ROLE
          </div>
          <h3 className="mb-1 font-bold font-display text-lg tracking-tight md:text-xl">
            {role.name}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users weight="bold" className="min-w-min" />
            <p className="line-clamp-1 text-sm">
              {roleAcquirementPercentage < 18 && "Only "}
              {roleAcquirementPercentage}% of members have this role
            </p>
          </div>
        </div>
        {collection && !!collections.length && (
          <div className="col-span-2 flex w-full flex-col gap-2 justify-self-end md:col-span-1 md:w-auto md:flex-row md:items-center">
            <Separator className="mb-2 md:hidden" />
            <div className="font-extrabold text-muted-foreground text-xs uppercase">
              COLLECTION:
            </div>

            <div className="ml-3 flex">
              <ContributionCollection collection={collection} guildId={guild.id} />
            </div>
          </div>
        )}
      </div>
    </CardWithGuildLabel>
  )
}
