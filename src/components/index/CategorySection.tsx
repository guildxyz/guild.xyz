import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string | JSX.Element
  fallbackText: string | JSX.Element
}

const CategorySection = ({
  title,
  fallbackText,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack spacing={5}>
    <Heading fontSize={{ base: "md", sm: "lg" }} as="h2">
      {title}
    </Heading>
    {children ? (
      <SimpleGrid
        templateRows="max-content"
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 5, md: 6 }}
      >
        {children}
      </SimpleGrid>
    ) : (
      <Text>{fallbackText}</Text>
    )}
  </Stack>
)

export default CategorySection
