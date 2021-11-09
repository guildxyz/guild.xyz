import { SimpleGrid, Text } from "@chakra-ui/react"
import Section from "components/common/Section"
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  title: string | JSX.Element
  fallbackText: string
  animated?: boolean
} & Rest

const MotionSimpleGrid = motion(SimpleGrid)

const simpleGridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const CategorySection = ({
  title,
  fallbackText,
  animated,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const animatedProps = animated
    ? {
        variants: simpleGridVariants,
        initial: "hidden",
        animate: "show",
      }
    : {}

  return (
    <Section title={title} {...rest}>
      <AnimateSharedLayout>
        {children ? (
          <MotionSimpleGrid
            templateRows="max-content"
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 5, md: 6 }}
            {...animatedProps}
          >
            <AnimatePresence>{children}</AnimatePresence>
          </MotionSimpleGrid>
        ) : (
          <Text>{fallbackText}</Text>
        )}
      </AnimateSharedLayout>
    </Section>
  )
}

export default CategorySection
