import { SimpleGrid, Text } from "@chakra-ui/react"
import Section from "components/common/Section"
import { AnimatePresence, AnimateSharedLayout } from "framer-motion"
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
}: PropsWithChildren<Props>) => (
  <Section title={title} {...rest}>
    {children ? (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
        <AnimateSharedLayout>
          <AnimatePresence>{children}</AnimatePresence>
        </AnimateSharedLayout>
      </SimpleGrid>
    ) : (
      <Text>{fallbackText}</Text>
    )}
  </Section>
)

export default CategorySection
