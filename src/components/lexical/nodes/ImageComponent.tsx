import { Img } from "@chakra-ui/react"
import { useRef } from "react"

const ImageComponent = ({
  src,
  altText,
  width,
  height,
}: {
  src: string
  altText: string
  width: "inherit" | number
  height: "inherit" | number
}): JSX.Element => {
  const imageRef = useRef<null | HTMLImageElement>(null)

  return (
    <Img
      ref={imageRef}
      src={src}
      alt={altText}
      style={{
        height,
        width,
      }}
    />
  )
}

export default ImageComponent
