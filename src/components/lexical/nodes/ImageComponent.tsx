import type { LexicalEditor, NodeKey } from "lexical"

import { Img } from "@chakra-ui/react"
import { Suspense, useRef } from "react"

const LazyImage = ({
  altText,
  imageRef,
  src,
  width,
  height,
  maxWidth,
}: {
  altText: string
  height: "inherit" | number
  imageRef: { current: null | HTMLImageElement }
  maxWidth: number
  src: string
  width: "inherit" | number
}): JSX.Element => (
  <Img
    ref={imageRef}
    src={src}
    alt={altText}
    style={{
      height,
      maxWidth,
      width,
    }}
  />
)

const ImageComponent = ({
  src,
  altText,
  width,
  height,
  maxWidth,
}: {
  altText: string
  caption: LexicalEditor
  height: "inherit" | number
  maxWidth: number
  nodeKey: NodeKey
  resizable: boolean
  showCaption: boolean
  src: string
  width: "inherit" | number
  captionsEnabled: boolean
}): JSX.Element => {
  const imageRef = useRef<null | HTMLImageElement>(null)

  return (
    // TODO: define fallback
    <Suspense fallback={null}>
      <LazyImage
        src={src}
        altText={altText}
        imageRef={imageRef}
        width={width}
        height={height}
        maxWidth={maxWidth}
      />
    </Suspense>
  )
}

export default ImageComponent
