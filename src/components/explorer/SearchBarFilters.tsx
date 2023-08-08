import { Button, Card, HStack, Icon, useColorModeValue } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { CircleWavyCheck, PushPin, Sparkle } from "phosphor-react"

const ExplorerFilters = ["FEATURED", "NEWEST", "VERIFIED"] as const
export type Filters = (typeof ExplorerFilters)[number]

type Props = {
  selected: Filters
  onSelect: (filter: Filters) => void
}

const icons: { [K in Filters]: any } = {
  FEATURED: PushPin,
  VERIFIED: CircleWavyCheck,
  NEWEST: Sparkle,
}

const SearchBarFilters = ({ selected, onSelect }: Props): JSX.Element => {
  const selectedBg = useColorModeValue("white", "gray.600")
  const selectedShadow = "0 0.5px 2px 0 rgba(0, 0, 0, 0.2)"
  const MotionCard = motion(Card)

  return (
    <HStack as="ul" gap={1.5}>
      {ExplorerFilters.map((filter) => (
        <Button
          key={filter}
          leftIcon={<Icon as={icons[filter]} />}
          as="label"
          cursor="pointer"
          borderRadius="lg"
          alignSelf="center"
          size="sm"
          bgColor={"transparent"}
          onClick={() => onSelect(filter)}
          position={"relative"}
          zIndex={1}
          {...(selected === filter && { _hover: { bg: "transparent" } })}
        >
          {filter.toLowerCase()}
          {selected === filter ? (
            <MotionCard
              style={{
                position: "absolute",
                zIndex: "-1",
                width: "100%",
              }}
              layoutId="slide-bg"
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              boxShadow={selectedShadow}
              bgColor={`${selectedBg} !important`}
              height="var(--chakra-sizes-8)"
            />
          ) : null}
        </Button>
      ))}
    </HStack>
  )
}

export default SearchBarFilters
