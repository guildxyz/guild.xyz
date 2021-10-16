import {
  Box,
  Container,
  Heading,
  HStack,
  Img,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import Head from "next/head"
import { PropsWithChildren, ReactNode } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"

type Props = {
  imageUrl?: string
  title: string
  description?: string
  action?: ReactNode | undefined
  editMode?: boolean
}

const GroupLayout = ({
  imageUrl,
  title,
  description,
  action,
  editMode,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  const exactImageSize = useBreakpointValue({
    base: "1.5rem",
    lg: "2rem",
  })

  return (
    <>
      <Head>
        <title>{`${title}`}</title>
        <meta property="og:title" content={`${title}`} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
          </>
        )}
      </Head>
      <Box
        position="relative"
        bgColor={colorMode === "light" ? "gray.100" : "gray.800"}
        minHeight="100vh"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h={editMode ? { base: 36, md: 48 } : { base: 64, md: 80 }}
          bgColor={"primary.500"}
          opacity={colorMode === "light" ? 1 : 0.5}
        />
        <Header whiteButtons />
        <Container
          position="relative"
          maxW="container.lg"
          pt={{ base: 4, md: 9 }}
          pb={{ base: 20, md: 14 }}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          <HStack
            spacing={{ md: 8 }}
            alignItems="center"
            justify="space-between"
            pb={{ base: 8, md: 16 }}
          >
            <HStack alignItems="center" spacing={{ base: 3, md: 4, lg: 5 }}>
              {imageUrl && (
                <Box
                  mt={{ base: 1, lg: 2 }}
                  padding={2}
                  bgColor={colorMode === "light" ? "primary.800" : "transparent"}
                  boxSize={{ base: 10, lg: 12 }}
                  rounded="full"
                >
                  <Img
                    src={imageUrl}
                    alt={`${title} - logo`}
                    htmlWidth={exactImageSize}
                    htmlHeight={exactImageSize}
                    boxSize={{ base: 6, lg: 8 }}
                  />
                </Box>
              )}
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontFamily="display"
                color={colorMode === "light" ? "primary.800" : "white"}
              >
                {title}
              </Heading>
            </HStack>

            {action}
          </HStack>
          {children}
        </Container>

        <Footer />
      </Box>
    </>
  )
}

export default GroupLayout
