import { Circle, Img, SkeletonCircle, useColorModeValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  isImageLoading?: boolean
}

const RequirementImageCircle = ({
  isImageLoading,
  children,
}: PropsWithChildren<Props>) => {
  const imageBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <SkeletonCircle
      minW={"var(--chakra-space-11)"}
      boxSize={"var(--chakra-space-11)"}
      isLoaded={!isImageLoading}
    >
      <Circle
        size={"var(--chakra-space-11)"}
        backgroundColor={imageBgColor}
        alignItems="center"
        justifyContent="center"
        overflow={"hidden"}
      >
        {children}
      </Circle>
    </SkeletonCircle>
  )
}

const RequirementImage = ({ image }) => {
  if (typeof image !== "string") return image

  if (image.endsWith(".mp4"))
    return (
      <video
        src={image}
        width={"var(--chakra-space-11)"}
        height={"var(--chakra-space-11)"}
        muted
        autoPlay
        loop
      />
    )
  return (
    <Img
      src={image}
      maxWidth={"var(--chakra-space-11)"}
      maxHeight={"var(--chakra-space-11)"}
    />
  )
}

export { RequirementImage, RequirementImageCircle }
