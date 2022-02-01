import { Center, Image, SkeletonCircle } from "@chakra-ui/react"
import { Rest } from "types"

type Props = {
  img: string
  alt: string
} & Rest

const OptionImage = ({ img, alt, ...rest }: Props): JSX.Element => (
  <Center boxSize={5} flexShrink={0} {...rest}>
    <Image
      w="full"
      h="full"
      {...(!img?.includes(".svg") && {
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
