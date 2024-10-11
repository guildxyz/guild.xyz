import { CheckMark } from "@/components/CheckMark"
import { CircularProgressBar } from "@/components/CircularProgressBar"
import { ProfileAvatar } from "@/components/ProfileAvatar"
import { Anchor } from "@/components/ui/Anchor"
import { Avatar } from "@/components/ui/Avatar"
import { buttonVariants } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { IconButton } from "@/components/ui/IconButton"
import { Separator } from "@/components/ui/Separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { LevelBadge } from "@app/(marketing)/profile/_components/LevelBadge"
import { ArrowRight, DotsThreeVertical } from "@phosphor-icons/react"
import { File, SignOut } from "@phosphor-icons/react/dist/ssr"

import useConnectorNameAndIcon from "@/components/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import { useExperienceProgression } from "@app/(marketing)/profile/_hooks/useExperienceProgression"
import useUser from "components/[guild]/hooks/useUser"
import { NetworkIndicator } from "../components/NetworkIndicator"

type AccountGuildProfileProps = {
  handleLogout: () => void
  onClose: () => void
}

export const AccountGuildProfile = ({
  handleLogout,
  onClose,
}: AccountGuildProfileProps) => {
  const { guildProfile } = useUser()
  const xp = useExperienceProgression(true)
  const { connectorName } = useConnectorNameAndIcon()

  if (!guildProfile) return null

  return (
    <div className="mb-8 flex gap-3">
      {xp && (
        <div className="relative mr-2 flex aspect-square items-center justify-center">
          <CircularProgressBar
            progress={xp.progress}
            color={xp.rank.color}
            className="absolute inset-0 size-full"
          />
          <Avatar
            size="2xl"
            className="m-1.5 flex items-center justify-center rounded-full border"
          >
            <ProfileAvatar
              username={guildProfile.username}
              profileImageUrl={guildProfile.profileImageUrl}
            />
          </Avatar>
          <LevelBadge
            level={xp.level}
            rank={xp.rank}
            className="absolute right-0.5 bottom-0.5"
          />
        </div>
      )}
      <div className="flex w-full flex-col justify-center">
        <h3 className=" flex items-center font-bold">
          <span className="max-w-52 truncate">
            {guildProfile.name || guildProfile.username}
          </span>
          <CheckMark className="ml-0.5 inline-block fill-yellow-500" />
        </h3>
        <div className="flex gap-2 text-muted-foreground text-sm">
          <span>@{guildProfile.username}</span>
          <Separator orientation="vertical" />
          {xp && (
            <Tooltip>
              <TooltipTrigger>{xp.experienceCount} XP</TooltipTrigger>
              <TooltipContent>
                {`${xp.currentLevelXp} -> `}
                <span className="font-bold">{xp.experienceCount} XP</span>
                {` -> ${xp.nextLevelXp}`}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="mt-2 flex gap-1.5">
          <Anchor
            href={`/profile/${guildProfile.username}`}
            className={buttonVariants({
              className: "w-full gap-3",
              size: "sm",
            })}
            variant="unstyled"
            onClick={onClose}
          >
            View profile
            <ArrowRight weight="bold" />
          </Anchor>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                aria-label="Open menu"
                variant="outline"
                size="sm"
                icon={<DotsThreeVertical weight="bold" />}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="flex items-center gap-2 px-4 font-semibold">
                <File weight="bold" className="size-4" />
                Purchase history
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="mt-2 flex gap-1 px-4 text-muted-foreground">
                Connected with {connectorName}
                <NetworkIndicator />
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="flex items-center gap-2 px-4 font-semibold"
                onClick={handleLogout}
              >
                <SignOut weight="bold" className="size-4" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
