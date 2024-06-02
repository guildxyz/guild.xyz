import { Box, BoxProps } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Image from "next/image"

type Props = {
  image?: JSX.Element
  imageUrl?: string
  background?: string
  backgroundProps?: BoxProps
  backgroundImage?: string
  backgroundOffset?: number
}

export const Background = ({
  background,
  backgroundImage,
  backgroundProps,
  backgroundOffset,
}: Props) => {
  const colorContext = useThemeContext()

  return (
    (background || backgroundImage) && (
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h={`calc(100% + ${backgroundOffset}px)`}
        background={"gray.900"}
      >
        {backgroundImage ? (
          <Image
            src={backgroundImage}
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
            background={background}
            opacity={colorContext?.textColor === "primary.800" ? 1 : ".5"}
            {...backgroundProps}
          />
        )}
      </Box>
    )
  )
}
