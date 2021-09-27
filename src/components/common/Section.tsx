import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string | JSX.Element
  description?: string
  fallbackText?: string | JSX.Element
  gridLayout?: boolean
}

const Section = ({
  title,
  description,
  fallbackText,
  gridLayout = false,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack width="full" spacing={5}>
    <Heading fontSize={{ base: "md", sm: "lg" }} as="h2">
      {title}
    </Heading>

    {description && (
      <Text fontSize="sm" fontWeight="medium" colorScheme="gray">
        {description}
      </Text>
    )}

    {(gridLayout &&
      (children ? (
        <SimpleGrid
          templateRows="max-content"
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 5, md: 6 }}
        >
          {children}
        </SimpleGrid>
      ) : (
        <Text>{fallbackText}</Text>
      ))) || <Box>{children}</Box>}
  </Stack>
)

export default Section
