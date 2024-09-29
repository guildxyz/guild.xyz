import { CheckMark } from "@/components/CheckMark"
import { Anchor } from "@/components/ui/Anchor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { Icon } from "@phosphor-icons/react"
import {
  Calendar,
  FolderSimpleUser,
  Star,
  User,
} from "@phosphor-icons/react/dist/ssr"
import useGuild from "components/[guild]/hooks/useGuild"
import Image from "next/image"
import { PropsWithChildren } from "react"
import { GuildBase } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

export const OperatedGuild = ({ guildBase }: { guildBase: GuildBase }) => {
  const guild = useGuild(guildBase.id)
  const rewardCount =
    guild.guildPlatforms &&
    guild.guildPlatforms.length +
      (guild?.roles?.reduce((acc, val) => acc + val?.rolePlatforms.length, 0) || 0)

  return (
    <Card className="flex flex-col bg-gray-50 md:flex-row dark:bg-card">
      <div className="relative w-full border-border-muted p-6 max-md:border-b md:w-1/3 md:border-r">
        <div className="absolute inset-0 bg-black" />
        {guild.theme?.backgroundImage ? (
          <Image
            className="absolute inset-0 size-full object-cover opacity-30"
            src={guild.theme.backgroundImage}
            alt="guild banner"
            width={419}
            height={233}
          />
        ) : (
          guild.theme?.color && (
            <div
              className="absolute inset-0 size-full object-cover opacity-30"
              style={{ background: guild.theme.color }}
            />
          )
        )}
        <div className="relative flex h-full flex-col items-center justify-center gap-3">
          <Avatar className="size-20 lg:size-24">
            <AvatarImage
              src={guildBase.imageUrl}
              width={118}
              height={118}
              alt="guild image"
            />
            <AvatarFallback>
              <Skeleton className="size-full" />
            </AvatarFallback>
          </Avatar>
          <Anchor href={`/${guildBase.urlName}`} target="_blank">
            <h3 className="text-center font-bold font-display text-lg text-white lg:text-xl">
              {guildBase.name}
              {guildBase.tags.includes("VERIFIED") && (
                <CheckMark className="ml-2 inline-block size-6 align-text-top" />
              )}
            </h3>
          </Anchor>
        </div>
      </div>
      <div className="grid grow justify-stretch gap-2 p-5 sm:grid-cols-2">
        <OperatedGuildDetail Icon={User}>
          <EmphasizedData>
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 2,
            }).format(guildBase.memberCount)}
          </EmphasizedData>{" "}
          members
        </OperatedGuildDetail>
        <OperatedGuildDetail Icon={FolderSimpleUser}>
          <EmphasizedData>{guildBase.rolesCount}</EmphasizedData>
          roles
        </OperatedGuildDetail>
        <OperatedGuildDetail Icon={Star}>
          <EmphasizedData>{rewardCount}</EmphasizedData>
          rewards in total
        </OperatedGuildDetail>
        {guild.createdAt && (
          <OperatedGuildDetail Icon={Calendar}>
            Created{" "}
            <Tooltip>
              <TooltipTrigger>
                <EmphasizedData>
                  {formatRelativeTimeFromNow(
                    Date.now().valueOf() - new Date(guild.createdAt).valueOf()
                  )}
                </EmphasizedData>
              </TooltipTrigger>
              <TooltipContent>
                Created at{" "}
                <time className="ml-1 font-medium font-mono">
                  {new Date(guild.createdAt).toLocaleString()}
                </time>
              </TooltipContent>
            </Tooltip>{" "}
            ago
          </OperatedGuildDetail>
        )}
      </div>
    </Card>
  )
}

const OperatedGuildDetail = ({
  Icon,
  children,
}: PropsWithChildren<{ Icon: Icon }>) => (
  <Card className="flex items-center gap-2 rounded-xl p-4 font-bold shadow md:p-5 dark:bg-secondary">
    <Icon weight="bold" className="min-w-min" />
    <span className="text-muted-foreground">{children}</span>
  </Card>
)

const EmphasizedData = ({ children }: PropsWithChildren) => (
  <span className="font-black text-foreground"> {children} </span>
)
