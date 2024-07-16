/**
 * TODO: we should use this new component everywhere & remove the old GuildLogo
 * (src/components/common/GuildLogo.tsx)
 */

import { cn } from "@/lib/utils"
import Image from "next/image"

const IMAGE_QUALITY = 70 as const

type Props = {
  imageUrl: string
  className?: string
}

const GuildLogo = ({ imageUrl, className }: Props) => {
  return (
    <div
      className={cn(
        "relative flex size-12 items-center justify-center overflow-hidden rounded-full bg-image",
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
            width={48}
            height={48}
            className="object-cover"
          />
        ))}
    </div>
  )
}

export { GuildLogo }
