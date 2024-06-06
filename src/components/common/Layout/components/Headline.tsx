import { Box, HStack, Heading, VStack } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import NextHead from "next/head"
import { ReactNode } from "react"

type Props = {
  image?: JSX.Element
  title: JSX.Element | string
  description?: JSX.Element
  action?: ReactNode
  ogTitle?: string
  ogDescription?: string
  shortcutImageUrl?: string
}

const Headline = ({
  image,
  title,
  description,
  action,
  ogDescription,
  ogTitle,
  shortcutImageUrl,
}: Props) => {
  const { textColor } = useThemeContext()

  return (
    <>
      <NextHead>
        <title>{ogTitle}</title>
        <meta property="og:title" content={ogTitle} />
        <link rel="shortcut icon" href={shortcutImageUrl ?? "/guild-icon.png"} />
        <meta name="description" content={ogDescription} />
        <meta property="og:description" content={ogDescription} />
      </NextHead>
      <VStack
        spacing={{ base: 7, md: 10 }}
        pb={{ base: 9, md: 14 }}
        w="full"
        maxW={"var(--layout-max-width)"}
        zIndex={1}
        pt={{ base: 6, md: 9 }}
        px={{ base: 4, sm: 6, md: 8, lg: 10 }}
      >
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
          <Box w="full" fontWeight="semibold" color={textColor} mb="-2 !important">
            {description}
          </Box>
        )}
      </VStack>
    </>
  )
}

export default Headline
