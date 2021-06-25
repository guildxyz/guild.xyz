import { Heading, Stack } from "@chakra-ui/react"

type Props = {
  title: string
  children: JSX.Element
}

const CategorySection = ({ title, children }: Props): JSX.Element => (
  <Stack spacing={4}>
    <Heading size="md" as="h4">
      {title}
    </Heading>
    {children}
  </Stack>
)

export default CategorySection
