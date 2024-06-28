import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import addressAvatarPairs from "static/avatars/addressAvatarPairs"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  address: `0x${string}`
}

const GuildAvatar = ({ address, className }: Props) => {
  const Avatar = dynamic(
    () =>
      import(
        `static/avatars/${addressAvatarPairs[address?.toLowerCase()?.slice(-2)]}.svg`
      )
  )

  return (
    <div className={cn("flex size-8 items-center justify-center", className)}>
      <Avatar />
    </div>
  )
}

export { GuildAvatar }
