import { Box, HStack, Heading, VStack } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { ReactNode } from "react"

type Props = {
  image?: JSX.Element
  // imageUrl?: string
  title?: JSX.Element | string
  // ogTitle?: string
  // ogDescription?: string
  description?: JSX.Element
  action?: ReactNode | undefined
  // background?: string
  // backgroundProps?: BoxProps
  // backgroundImage?: string
  // backgroundOffset?: number
  // backButton?: JSX.Element
  // maxWidth?: string
  // showFooter?: boolean
}

export const HeadLine = ({ image, title, description, action }: Props) => {
  const { textColor } = useThemeContext()

  return (
    (image || title || description) && (
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
          <Box w="full" fontWeight="semibold" color={textColor} mb="-2 !important">
            {description}
          </Box>
        )}
      </VStack>
    )
  )
}
