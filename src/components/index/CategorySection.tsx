import { Heading, SimpleGrid, Stack } from "@chakra-ui/react"
import { forwardRef, MutableRefObject } from "react"

type Props = {
  title: string
  children?: JSX.Element[] | JSX.Element
}

const CategorySection = forwardRef(
  ({ title, children }: Props, ref: MutableRefObject<HTMLDivElement>) => (
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
