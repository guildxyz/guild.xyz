import { AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Schemas } from "@guildxyz/types"
import dynamic from "next/dynamic"

interface ProfileAvatarProps
  extends Pick<Schemas["Profile"], "username" | "profileImageUrl"> {
  size: number
}

export const ProfileAvatar = ({
  username,
  profileImageUrl,
  size,
}: ProfileAvatarProps) => {
  const avatarIndex =
    Math.abs(username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
    64
  const PixelAvatarFallback = dynamic(
    () => import(`static/avatars/${avatarIndex}.svg`)
  )
  return profileImageUrl ? (
    <>
      <AvatarImage src={profileImageUrl} alt="profile" width={size} height={size} />
      <AvatarFallback />
    </>
  ) : (
    <div className="flex size-full items-center justify-center rounded-full bg-card *:size-1/2">
      <PixelAvatarFallback />
    </div>
  )
}
