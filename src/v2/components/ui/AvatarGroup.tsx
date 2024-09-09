import { cn } from "@/lib/utils"
import { AvatarImage } from "@radix-ui/react-avatar"
import { VariantProps } from "class-variance-authority"
import { Avatar, AvatarFallback, avatarVariants } from "./Avatar"
import { Skeleton } from "./Skeleton"

interface AvatarGroupProps extends VariantProps<typeof avatarVariants> {
  count?: number
  imageUrls: string[]
}

export const AvatarGroup = ({
  count = 0,
  imageUrls,
  ...avatarProps
}: AvatarGroupProps) => {
  const diffCount = count - imageUrls.length
  return (
    <div className="ml-3 flex">
      {imageUrls.map((src, i) => (
        <Avatar key={i} className={cn(avatarVariants(avatarProps), "-ml-3 border")}>
          <AvatarImage src={src} alt="avatar" className="size-full object-cover" />
          <AvatarFallback>
            <Skeleton className="size-full" />
          </AvatarFallback>
        </Avatar>
      ))}
      {diffCount > 0 && (
        <Avatar className={cn(avatarVariants(avatarProps), "-ml-3 border")}>
          <AvatarFallback>+{diffCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
