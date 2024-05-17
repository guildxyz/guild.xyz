import { Box, BoxProps, useColorMode } from "@chakra-ui/react"
import { ReactNode, useRef, useState } from "react"
import Image from "next/image"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useIsomorphicLayoutEffect from "hooks/useIsomorphicLayoutEffect"

type Props = {
  image?: JSX.Element
  imageUrl?: string
  // title?: JSX.Element | string
  // ogTitle?: string
  // ogDescription?: string
  // description?: JSX.Element
  // action?: ReactNode | undefined
  background?: string
  backgroundProps?: BoxProps
  backgroundImage?: string
  backgroundOffset?: number
  // backButton?: JSX.Element
  // maxWidth?: string
  // showFooter?: boolean
}

export const Background = ({
  background,
  backgroundImage,
  backgroundProps,
  backgroundOffset,
}: Props) => {
  const childrenWrapper = useRef(null)
  const [bgHeight, setBgHeight] = useState("0")
  const colorContext = useThemeContext()

  // useIsomorphicLayoutEffect(() => {
  //   if ((!background && !backgroundImage) || !childrenWrapper?.current) return
  //
  //   const rect = childrenWrapper.current.getBoundingClientRect()
  //   setBgHeight(`${rect.top + (window?.scrollY ?? 0) + backgroundOffset}px`)
  // }, [
  //   title,
  //   description,
  //   background,
  //   backgroundImage,
  //   childrenWrapper?.current,
  //   action,
  //   backgroundOffset,
  // ])

  // const { colorMode } = useColorMode()

  return (
    (background || backgroundImage) && (
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h={bgHeight}
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
