import { Heading, SimpleGrid, Stack } from "@chakra-ui/react"

type Props = {
  title: string
  fallback: JSX.Element
}

const CategorySection = ({ title, fallback, children }) => (
  <Stack spacing={5}>
    <Heading fontSize={{ base: "md", sm: "lg" }} as="h2">
      {title}
    </Heading>
    {children.length ? (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
        {children}
      </SimpleGrid>
    ) : (
      { ...fallback }
    )}
  </Stack>
)

export default CategorySection
