import { LayoutTitle } from "@/components/Layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"
import { useThemeContext } from "./ThemeContext"
import useRoleGroup from "./hooks/useRoleGroup"

const GroupPageImageAndName = () => {
  const group = useRoleGroup()
  const { avatarBg } = useThemeContext()

  return (
    <>
      {group?.imageUrl && (
        <Avatar className={cn("row-span-2 size-20 md:size-24", avatarBg)}>
          <AvatarImage
            src={group.imageUrl}
            alt={`${name} logo`}
            width={96}
            height={96}
          />
          <AvatarFallback>
            <Skeleton className="size-full" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex items-start gap-1 sm:gap-1.5">
        <LayoutTitle className="line-clamp-1 break-all leading-tight sm:leading-tight">
          {group?.name ?? "Page"}
        </LayoutTitle>
      </div>
    </>
  )
}
export { GroupPageImageAndName }
