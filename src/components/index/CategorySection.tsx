import { Heading, SimpleGrid, Stack } from "@chakra-ui/react"
import { forwardRef, PropsWithChildren } from "react"

type Props = {
  title: string
}

const CategorySection = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ title, children }, ref) => (
    <Stack spacing={5}>
      <Heading fontSize={{ base: "md", sm: "lg" }} as="h2">
        {title}
      </Heading>

      <SimpleGrid
        ref={ref}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 5, md: 6 }}
      >
        {children}
      </SimpleGrid>
    </Stack>
  )
)

export default CategorySection
