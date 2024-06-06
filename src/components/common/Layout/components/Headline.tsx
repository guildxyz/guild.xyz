import { Box, HStack, Heading, VStack } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { ReactNode } from "react"

type Props = {
  image: JSX.Element
  title: JSX.Element | string
  description: JSX.Element
  action?: ReactNode
}

const Headline = ({ image, title, description, action }: Props) => {
  const { textColor } = useThemeContext()

  return (
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
  )
}

export default Headline
