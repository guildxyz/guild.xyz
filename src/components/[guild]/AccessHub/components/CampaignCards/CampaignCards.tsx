import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { buttonVariants } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { ArrowRight, EyeSlash, Plus } from "@phosphor-icons/react/dist/ssr"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"

const DynamicCampaignCardMenu = dynamic(
  () => import("./components/CampaignCardMenu")
)

const CampaignCards = () => {
  const { isAdmin } = useGuildPermission()

  const {
    groups,
    roles,
    imageUrl: guildImageUrl,
    urlName: guildUrlName,
  } = useGuild()
  const { query } = useRouter()

  if (!groups?.length || !!query.group) return null

  const renderedGroups = isAdmin
    ? groups
    : groups.filter((group) => !group.hideFromGuildPage)

  return (
    <>
      {renderedGroups.map(({ id, imageUrl, name, urlName, hideFromGuildPage }) => {
        const groupHasRoles = roles?.some((role) => role.groupId === id)
        if (!isAdmin && !groupHasRoles) return null

        let campaignImage = ""
        if (typeof imageUrl === "string" && imageUrl.length > 0)
          campaignImage = imageUrl
        else if (typeof guildImageUrl === "string" && guildImageUrl.length > 0)
          campaignImage = guildImageUrl

        return (
          <Card
            key={id}
            className="relative flex flex-col justify-between p-5 sm:p-6"
          >
            {isAdmin && <DynamicCampaignCardMenu groupId={id} />}

            <div className="mb-5 flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={campaignImage} alt={name} width={40} height={40} />
                <AvatarFallback>
                  <Skeleton className="size-full" />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="font-bold">{name}</span>
                {hideFromGuildPage && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>
                        <EyeSlash weight="bold" />
                        <span>Hidden</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>
                        Members don't see this, they can only access this page by
                        visiting it's link directly
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            {groupHasRoles ? (
              <Link
                className={cn(buttonVariants({ colorScheme: "primary" }))}
                href={`/${guildUrlName}/${urlName}`}
                prefetch={false}
              >
                <span>View page</span>
                <ArrowRight weight="bold" />
              </Link>
            ) : (
              <Link
                className={cn(buttonVariants({ variant: "outline" }))}
                href={`/${guildUrlName}/${urlName}`}
                prefetch={false}
              >
                <Plus weight="bold" />
                <span>Add roles</span>
              </Link>
            )}
          </Card>
        )
      })}
    </>
  )
}

export default CampaignCards
