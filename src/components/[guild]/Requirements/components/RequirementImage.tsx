import { Skeleton } from "@/components/ui/Skeleton"
import { PropsWithChildren, ReactNode } from "react"

type Props = {
  isImageLoading?: boolean
}

const RequirementImageCircle = ({
  isImageLoading,
  children,
}: PropsWithChildren<Props>) =>
  isImageLoading ? (
    <Skeleton className="size-11 shrink-0 rounded-full" />
  ) : (
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blackAlpha-soft dark:bg-blackAlpha">
      {children}
    </div>
  )

const RequirementImage = ({ image }: { image: ReactNode | string }) => {
  if (typeof image !== "string") return image

  if (image.endsWith(".mp4"))
    return <video src={image} className="size-11" muted autoPlay loop />
  return <img src={image} className="max-h-11 max-w-11" />
}

export { RequirementImage, RequirementImageCircle }
