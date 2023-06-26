import { BorderProps, Box, Flex, Img, Spinner } from "@chakra-ui/react"
import Card from "components/common/Card"

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
    ) : (
      <>
        <Box
          position="absolute"
          inset={0}
          bgImage={src}
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
    )}
  </Card>
)

export default CollectibleImage
