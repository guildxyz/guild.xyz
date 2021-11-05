import { SimpleGrid, Text } from "@chakra-ui/react"
import Section from "components/common/Section"
import { AnimateSharedLayout, motion } from "framer-motion"
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
        <motion.div layout>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 5, md: 6 }}
          >
            {children}
          </SimpleGrid>
        </motion.div>
      ) : (
        <Text>{fallbackText}</Text>
      )}
    </AnimateSharedLayout>
  </Section>
)

export default CategorySection
