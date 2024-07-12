import { Box, HStack, Icon, useColorModeValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import { motion } from "framer-motion"
import { PushPin, Sparkle } from "phosphor-react"

const ExplorerFilters = ["FEATURED", "NEWEST"] as const
export type Filters = (typeof ExplorerFilters)[number]

type Props = {
  selected: Filters
  onSelect: (filter: Filters) => void
}

const icons: { [K in Filters]: any } = {
  FEATURED: PushPin,
  NEWEST: Sparkle,
}

const SearchBarFilters = ({ selected, onSelect }: Props): JSX.Element => {
  const selectedBg = useColorModeValue("white", "gray.600")
  const selectedShadow = "0 0.5px 2px 0 rgba(0, 0, 0, 0.2)"
  const MotionBox = motion(Box)

  return (
    <HStack as="ul" gap={1.5}>
      {ExplorerFilters.map((filter) => (
        <Box key={filter} position={"relative"}>
          <Button
            leftIcon={<Icon as={icons[filter]} />}
            size="sm"
            variant="ghost"
            borderRadius="lg"
            onClick={() => onSelect(filter)}
            zIndex={1}
            {...(selected === filter && { _hover: { bg: "transparent" } })}
          >
            {filter.toLowerCase()}
          </Button>
          {selected === filter ? (
            <MotionBox
              style={{
                position: "absolute",
                inset: 0,
              }}
              layoutId="slide-bg"
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              boxShadow={selectedShadow}
              borderRadius="lg"
              bgColor={`${selectedBg} !important`}
              height="var(--chakra-sizes-8)"
            />
          ) : null}
        </Box>
      ))}
    </HStack>
  )
}

export default SearchBarFilters
