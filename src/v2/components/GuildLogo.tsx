/**
 * TODO: we should use this new component everywhere & remove the old GuildLogo
 * (src/components/common/GuildLogo.tsx)
 */

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Image from "next/image"

const IMAGE_QUALITY = 70

type Props = {
  imageUrl: string
  className?: string
}

const GuildLogo = ({ imageUrl, className }: Props) => {
  const { resolvedTheme } = useTheme()
  // TODO: should we move it to a CSS variable?
  const bgColor = resolvedTheme === "light" ? "bg-gray-700" : "bg-gray-600"

  return (
    <div
      className={cn(
        "relative flex size-12 items-center justify-center overflow-hidden rounded-full",
        bgColor,
        className
      )}
    >
      {imageUrl &&
        (imageUrl?.match("guildLogos") ? (
          <img src={imageUrl} alt="Guild logo" className="size-[40%]" />
        ) : (
          <Image
            src={imageUrl}
            quality={IMAGE_QUALITY}
            alt="Guild logo"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        ))}
    </div>
  )
}

export { GuildLogo }
