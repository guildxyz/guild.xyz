import {
  Box,
  BoxProps,
  Container,
  Heading,
  HStack,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useIsomorphicLayoutEffect from "hooks/useIsomorphicLayoutEffect"
import Head from "next/head"
import Image from "next/image"
import { PropsWithChildren, ReactNode, useRef, useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"

type Props = {
  image?: JSX.Element
  imageUrl?: string
  title?: JSX.Element | string
  ogTitle?: string
  ogDescription?: string
  description?: JSX.Element
  textColor?: string
  action?: ReactNode | undefined
  background?: string
  backgroundProps?: BoxProps
  backgroundImage?: string
  backgroundOffset?: number
  backButton?: JSX.Element
  maxWidth?: string
  showFooter?: boolean
} & Omit<BoxProps, "title">

const Layout = ({
  image,
  imageUrl,
  ogTitle,
  title,
  ogDescription,
  description,
  textColor,
  action,
  background,
  backgroundProps,
  backgroundImage,
  backgroundOffset = 128,
  backButton,
  maxWidth = "container.lg",
  showFooter = true,
  children,
  ...wrapperProps
}: PropsWithChildren<Props>): JSX.Element => {
  const childrenWrapper = useRef(null)
  const [bgHeight, setBgHeight] = useState("0")

  const colorContext = useThemeContext()

  useIsomorphicLayoutEffect(() => {
    if ((!background && !backgroundImage) || !childrenWrapper?.current) return

    const rect = childrenWrapper.current.getBoundingClientRect()
    setBgHeight(`${rect.top + (window?.scrollY ?? 0) + backgroundOffset}px`)
  }, [
    title,
    description,
    background,
    backgroundImage,
    childrenWrapper?.current,
    action,
    backgroundOffset,
  ])

  const { colorMode } = useColorMode()

  return (
    <>
      <Head>
        <title>{`${ogTitle ?? title}`}</title>
        <meta property="og:title" content={`${ogTitle ?? title}`} />
        <link rel="shortcut icon" href={imageUrl ?? "/guild-icon.png"} />
        {ogDescription && (
          <>
            <meta name="description" content={ogDescription} />
            <meta property="og:description" content={ogDescription} />
          </>
        )}
      </Head>
      <Box
        position="relative"
        bgColor={colorMode === "light" ? "gray.100" : "gray.800"}
        bgGradient={
          !background
            ? `linear(${
                colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
              } 0px, var(--chakra-colors-gray-100) 700px)`
            : undefined
        }
        bgBlendMode={colorMode === "light" ? "normal" : "color"}
        minHeight="100vh"
        display="flex"
        flexDir={"column"}
        color="var(--chakra-colors-chakra-body-text)"
      >
        {(background || backgroundImage) && (
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
        )}
        <Header />
        <Container
          // to be above the absolutely positioned background box
          position="relative"
          maxW={maxWidth}
          pt={{ base: 6, md: 9 }}
          pb={showFooter && 24}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          {backButton}
          {(image || title || description) && (
            <VStack spacing={{ base: 7, md: 10 }} pb={{ base: 9, md: 14 }} w="full">
              <HStack justify="space-between" w="full" spacing={3}>
                <HStack alignItems="center" spacing={{ base: 4, lg: 5 }}>
                  {image}
                  <HStack gap={1}>
                    <Heading
                      as="h1"
                      fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                      fontFamily="display"
                      color={textColor}
                      wordBreak={"break-word"}
                    >
                      {title}
                    </Heading>
                  </HStack>
                </HStack>
                {action}
              </HStack>

              {description && (
                <Box
                  w="full"
                  fontWeight="semibold"
                  color={textColor}
                  mb="-2 !important"
                >
                  {description}
                </Box>
              )}
            </VStack>
          )}
          <Box ref={childrenWrapper} {...wrapperProps}>
            {children}
          </Box>
        </Container>

        {showFooter && <Footer />}
      </Box>
    </>
  )
}

export default Layout
