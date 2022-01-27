import { Center, Image, SkeletonCircle } from "@chakra-ui/react"

type Props = {
  img: string
  alt: string
}

const OptionImage = ({ img, alt }: Props): JSX.Element => (
  <Center boxSize={5} mr="2" flexShrink={0}>
    <Image
      w="full"
      h="full"
      {...(!img.includes(".svg") && {
        objectFit: "cover",
        rounded: "full",
      })}
      src={img}
      alt={alt}
      fallback={<SkeletonCircle w="full" h="full" />}
    />
  </Center>
)

export default OptionImage
