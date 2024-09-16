import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { Guild } from "@guildxyz/types"
import Color from "color"
import { PropsWithChildren } from "react"

export const CardWithGuildLabel = ({
  guild,
  children,
}: PropsWithChildren<{ guild: Guild }>) => {
  const color = guild.theme.color && Color(guild.theme.color)

  return (
    <Card
      className="relative flex border-4 bg-accent sm:border-2"
      style={{ borderColor: guild.theme.color, background: guild.theme.color }}
    >
      <div
        className="absolute inset-x-0 h-9 w-full px-2 sm:top-0 sm:h-full sm:w-8 sm:p-0"
        style={{ background: guild.theme.color }}
        title={guild.name}
      >
        <div className="sm:-translate-x-1/2 sm:-rotate-90 flex h-full items-center gap-1 sm:absolute sm:left-1/2 sm:max-w-28 sm:justify-center">
          <Avatar size="xs">
            <AvatarImage
              src={guild.imageUrl}
              alt="guild avatar"
              width={32}
              height={32}
            />
            <AvatarFallback />
          </Avatar>
          <div
            className={cn(
              "-mt-0.5 truncate font-bold font-display text-foreground text-sm",
              color && (color.isDark() ? "text-white" : "text-black")
            )}
          >
            {guild.name}
          </div>
        </div>
      </div>
      <div className="mt-9 size-full rounded-2xl bg-card sm:mt-0 sm:ml-8">
        {children}
      </div>
    </Card>
  )
}
