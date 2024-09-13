import { AvatarFallback } from "@/components/ui/Avatar"
import { Schemas } from "@guildxyz/types"
import { AvatarImage } from "@radix-ui/react-avatar"
import dynamic from "next/dynamic"

interface ProfileAvatarProps
  extends Pick<Schemas["Profile"], "username" | "profileImageUrl"> {}

export const ProfileAvatar = ({ username, profileImageUrl }: ProfileAvatarProps) => {
  const avatarIndex =
    (Math.abs(
      username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) %
      64) +
    1
  const PixelAvatarFallback = dynamic(
    () => import(`static/avatars/${avatarIndex}.svg`)
  )
  return profileImageUrl ? (
    <>
      <AvatarImage
        src={profileImageUrl}
        alt="profile"
        className="size-full object-cover"
      />
      <AvatarFallback />
    </>
  ) : (
    <div className="flex size-full items-center justify-center rounded-full bg-card *:size-1/2">
      <PixelAvatarFallback />
    </div>
  )
}
