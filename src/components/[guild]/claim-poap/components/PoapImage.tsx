import {
  AspectRatio,
  BorderProps,
  Box,
  Center,
  Flex,
  Icon,
  Img,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react"
import { Image } from "@phosphor-icons/react"
import Card from "components/common/Card"
import PoapBg from "static/icons/poap-bg.svg"

type Props = {
  src: string
  isLoading: boolean
  borderRadius?: BorderProps["borderRadius"]
}

const PoapImage = ({ src, isLoading, borderRadius = "2xl" }: Props) => {
  const poapImageBgColor = useColorModeValue("gray.200", "blackAlpha.300")
  const poapPatternOpacity = useColorModeValue(0.1, 0.2)

  return (
    <Card
      w="full"
      aspectRatio={1}
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius={borderRadius}
    >
      <Box
        position="absolute"
        inset={0}
        bgImage="url('/img/poap-pattern.svg')"
        bgSize="25%"
        opacity={poapPatternOpacity}
        sx={{
          WebkitMaskImage: `radial-gradient(transparent 35%, black)`,
        }}
      />
      {isLoading ? (
        <Flex alignItems="center" justifyContent="center">
          <Spinner thickness="4px" size="xl" color="gray" />
        </Flex>
      ) : src?.length ? (
        <Center p="15%" maxW="full">
          <Box position="relative" maxW="full" w="md">
            <Icon as={PoapBg} w="full" h="full" color={poapImageBgColor} />
            <Img
              position="absolute"
              inset="10%"
              mt={-0.5}
              src={src}
              borderRadius="full"
              w="80%"
              alt="POAP image"
            />
          </Box>
        </Center>
      ) : (
        <AspectRatio w="full" ratio={1} justifyContent="center">
          <Icon mx="auto" as={Image} weight="light" maxW="50%" color="gray.500" />
        </AspectRatio>
      )}
    </Card>
  )
}

export default PoapImage
