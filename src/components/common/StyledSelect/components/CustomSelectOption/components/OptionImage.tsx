import { Center, Image, InputLeftElement, SkeletonCircle } from "@chakra-ui/react"

type Props = {
  img: string
  alt: string
  asInputLeftElement?: boolean
}

const OptionImage = ({ img, alt, asInputLeftElement }: Props): JSX.Element => {
  if (asInputLeftElement)
    return (
      <InputLeftElement className="option-image">
        <Center boxSize={5} mx="auto" flexShrink={0}>
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
      </InputLeftElement>
    )

  return (
    <Center boxSize={5} mr="2" flexShrink={0}>
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
}

export default OptionImage
