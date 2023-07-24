import { Button, HStack, Icon, useColorModeValue } from "@chakra-ui/react"
import { CircleWavyCheck, Sparkle, StarFour } from "phosphor-react"

const ExplorerFilters = ["FEATURED", "NEWEST", "VERIFIED"] as const
export type Filters = (typeof ExplorerFilters)[number]

type Props = {
  selected: Filters
  onSelect: (filter: Filters) => void
}

const icons: { [K in Filters]: any } = {
  FEATURED: StarFour,
  VERIFIED: CircleWavyCheck,
  NEWEST: Sparkle,
}

const SearchBarFilters = ({ selected, onSelect }: Props): JSX.Element => {
  const selectedBg = useColorModeValue("white", "blackAlpha.400")
  const selectedShadow = useColorModeValue("sm", "md")

  return (
    <HStack as="ul" gap={1}>
      {ExplorerFilters.map((filter) => (
        <Button
          key={filter}
          leftIcon={<Icon as={icons[filter]} />}
          as="label"
          cursor="pointer"
          borderRadius="lg"
          alignSelf="center"
          size="sm"
          bgColor={selected === filter ? `${selectedBg} !important` : "transparent"}
          boxShadow={selected === filter ? selectedShadow : "none"}
          onClick={() => onSelect(filter)}
        >
          {filter.toLowerCase()}
        </Button>
      ))}
    </HStack>
  )
}

export default SearchBarFilters
