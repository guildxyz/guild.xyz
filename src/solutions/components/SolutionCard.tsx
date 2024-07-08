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
  const borderColor = useColorModeValue("blackAlpha.300", "whiteAlpha.200")
  const cardBg = useColorModeValue("white", "var(--chakra-colors-gray-800)")
  const boxShadow = useColorModeValue("sm", "md")
  const bgOpacity = useColorModeValue(0.2, 0.15)
  const gradientBg = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-800)"
  )

  return (
    <DisplayCard
      as="button"
      textAlign="left"
      boxShadow={boxShadow}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      px={4}
      py={4}
      onClick={onClick}
      zIndex={2}
      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        left: 0,
        bg: `linear-gradient(to bottom left, transparent, ${gradientBg} 100%), url('${bgImageUrl}')`,
        bgRepeat: "no-repeat",
        bgPosition: "center",
        bgSize: "cover",
        width: "100%",
        height: "100%",
        opacity: bgOpacity,
        transition: "0.3s",
        filter: `blur(2px) saturate(70%)`,
      }}
      _hover={{
        _before: {
          opacity: 0.25,
          filter: `blur(0) saturate(100%)`,
          transform: `scale(1.02)`,
        },
      }}
    >
      <Stack spacing={3} zIndex={1} justifyContent={"space-between"} h={"100%"}>
        <HStack gap={3}>
          <Circle size="12" pos="relative" overflow="hidden" bgColor={circleBgColor}>
            <Image src={imageUrl} alt="Guild logo" fill sizes="3rem" />
          </Circle>
          <Heading fontSize={"normal"} fontWeight="bold" maxW="full" noOfLines={1}>
            {title}
          </Heading>
        </HStack>
        {description && (
          <Text colorScheme="gray" lineHeight={1.33}>
            {description}
          </Text>
        )}
        {children}
      </Stack>
    </DisplayCard>
  )
}

export default SolutionCard
