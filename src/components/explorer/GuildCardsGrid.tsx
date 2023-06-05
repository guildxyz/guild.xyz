import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react"
import { AnimatePresence } from "framer-motion"
import { PropsWithChildren } from "react"

const GuildCardsGrid = ({
  children,
  ...rest
}: PropsWithChildren<SimpleGridProps>) => (
  <SimpleGrid
    columns={{ base: 1, md: 2, lg: 3 }}
    spacing={{ base: 4, md: 5 }}
    {...rest}
  >
    <AnimatePresence>{children}</AnimatePresence>
  </SimpleGrid>
)

export default GuildCardsGrid
