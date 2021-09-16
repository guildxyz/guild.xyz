import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"

type Props = {
  title: string
  fallbackText: string
}

const CategorySection = ({ title, fallbackText, children }) => (
  <Stack spacing={5}>
    <Heading fontSize={{ base: "md", sm: "lg" }} as="h2">
      {title}
    </Heading>

    {children.length ? (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
        {children}
      </SimpleGrid>
    ) : (
      <Text>{fallbackText}</Text>
    )}
  </Stack>
)

export default CategorySection
