import { CheckMark } from "@/components/CheckMark"
import { LayoutTitle } from "@/components/Layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"
import MemberCount from "./RoleCard/components/MemberCount"
import { useThemeContext } from "./ThemeContext"
import useGuild from "./hooks/useGuild"

const GuildPageImageAndName = () => {
  const { imageUrl, name, tags, memberCount } = useGuild()
  const { avatarBg, textColor, buttonColorScheme } = useThemeContext()

  return (
    <>
      {imageUrl && (
        <Avatar className={cn("row-span-2 size-20 md:size-24", avatarBg)}>
          <AvatarImage src={imageUrl} alt={`${name} logo`} width={96} height={96} />
          <AvatarFallback>
            <Skeleton className="size-full" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-1 sm:gap-1.5">
          <LayoutTitle className="line-clamp-1 break-all leading-tight sm:leading-tight">
            {name}
          </LayoutTitle>
          {tags?.includes("VERIFIED") && (
            <CheckMark className="mt-2.5 size-5 shrink-0 sm:mt-4 sm:size-6" />
          )}
        </div>

        <MemberCount
          memberCount={memberCount ?? 0}
          bgColor={`${buttonColorScheme}.200`}
          color={textColor}
          maxW="max-content"
        />
      </div>
    </>
  )
}
export { GuildPageImageAndName }
