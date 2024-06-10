import { Box, BoxProps } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Image from "next/image"

type Props = {
  image?: string
  offset?: number
} & BoxProps

const Background = ({ image, offset = 128, ...boxProps }: Props) => {
  const colorContext = useThemeContext()

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      w="full"
      h={`calc(100% + ${offset}px)`}
      background={"gray.900"}
    >
      {image ? (
        <Image
          src={image}
          alt="Guild background image"
          priority
          fill
          sizes="100vw"
          style={{
            filter: "brightness(30%)",
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          w="full"
          h="full"
          opacity={colorContext?.textColor === "primary.800" ? 1 : ".5"}
          {...boxProps}
        />
      )}
    </Box>
  )
}

export default Background
