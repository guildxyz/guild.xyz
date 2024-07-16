import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { memo } from "react"
import addressAvatarPairs from "static/avatars/addressAvatarPairs"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  address: `0x${string}`
}

const GuildAvatar = memo(({ address, className }: Props) => {
  const addressEnding = address
    ?.toLowerCase()
    ?.slice(-2) as keyof typeof addressAvatarPairs

  const Avatar = dynamic(
    () =>
      // webpack can't resolve the dynamic import path when running storybook, so we just pass the first svg manually there
      import(
        `static/avatars/${process.env.STORYBOOK ? 1 : addressAvatarPairs[addressEnding]}.svg`
      )
  )

  return (
    <div className={cn("flex size-8 items-center justify-center", className)}>
      <Avatar />
    </div>
  )
})

export { GuildAvatar }
