import {
  Circle,
  HStack,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Image from "next/image"

export type Props = {
  title: string
  imageUrl: string
  description: string
  bgImageUrl: string
  onClick?: (data?: any) => void
  children?: JSX.Element
}

const SolutionCard = ({
  title,
  description,
  imageUrl,
  bgImageUrl,
  onClick,
  children,
}: Props) => {
  const circleBgColor = useColorModeValue("whiteAlpha.300", "blackAlpha.300")
  const outlineColor = useColorModeValue("blackAlpha.300", "whiteAlpha.300")

  return (
    <>
      <DisplayCard
        boxShadow={"none"}
        px={4}
        py={4}
        position="relative"
        outline="1px solid white"
        outlineColor={outlineColor}
        outlineOffset="-1px"
        onClick={onClick}
        _before={{
          content: `""`,
          position: "absolute",
          top: 0,
          left: 0,
          bg: `url('${bgImageUrl}')`,
          bgRepeat: "no-repeat",
          bgPosition: "center",
          bgSize: "cover",
          width: "100%",
          height: "100%",
          opacity: 0.25,
          transition: "0.3s",
          filter: `blur(3px) saturate(50%)`,
        }}
        _hover={{
          _before: { opacity: 0.4, filter: `blur(3px) saturate(80%)` },
        }}
      >
        <Stack spacing={3} zIndex={1} justifyContent={"space-between"} h={"100%"}>
          <HStack gap={3}>
            <Circle
              size="12"
              pos="relative"
              overflow="hidden"
              bgColor={circleBgColor}
            >
              <Image src={imageUrl} alt="Guild logo" fill sizes="3rem" />
            </Circle>
            <Heading
              fontSize="lg"
              fontWeight="semibold"
              letterSpacing="wide"
              maxW="full"
              noOfLines={1}
            >
              {title}
            </Heading>
          </HStack>
          {description && (
            <Text colorScheme="gray" lineHeight={1.33} fontSize={"lg"}>
              {description}
            </Text>
          )}
          {children}
        </Stack>
      </DisplayCard>
    </>
  )
}

export default SolutionCard
