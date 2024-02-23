import {
  AspectRatio,
  BorderProps,
  Box,
  Flex,
  Icon,
  Img,
  Spinner,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Image } from "phosphor-react"

type Props = {
  src: string
  isLoading: boolean
  borderRadius?: BorderProps["borderRadius"]
}

const CollectibleImage = ({ src, isLoading, borderRadius = "2xl" }: Props) => (
  <Card
    w="full"
    p="15%"
    aspectRatio={isLoading ? 1 : "auto"}
    position="relative"
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius={borderRadius}
  >
    {isLoading ? (
      <Flex alignItems="center" justifyContent="center">
        <Spinner thickness="4px" size="xl" color="gray" />
      </Flex>
    ) : src?.length ? (
      <>
        <Box
          position="absolute"
          inset={0}
          bgImage={src}
          bgSize="cover"
          transform="scale(1.5)"
          filter="blur(20px)"
          opacity={0.75}
        />
        <Img
          position="relative"
          src={src}
          alt="NFT image"
          filter="drop-shadow(0px 1rem 2rem black)"
        />
      </>
    ) : (
      <AspectRatio w="full" ratio={1} justifyContent="center">
        <Icon mx="auto" as={Image} weight="light" maxW="50%" color="gray.500" />
      </AspectRatio>
    )}
  </Card>
)

export default CollectibleImage
