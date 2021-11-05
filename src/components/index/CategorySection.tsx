import { SimpleGrid, Text } from "@chakra-ui/react"
import Section from "components/common/Section"
import { AnimateSharedLayout } from "framer-motion"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  title: string | JSX.Element
  fallbackText: string
} & Rest

const CategorySection = ({
  title,
  fallbackText,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Section title={title} {...rest}>
    <AnimateSharedLayout>
      {children ? (
        <SimpleGrid
          templateRows="max-content"
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: 5, md: 6 }}
        >
          {children}
        </SimpleGrid>
      ) : (
        <Text>{fallbackText}</Text>
      )}
    </AnimateSharedLayout>
  </Section>
)

export default CategorySection
