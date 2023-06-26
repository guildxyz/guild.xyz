import { Flex, Icon, SimpleGrid, Tag, Text } from "@chakra-ui/react"
import { DotsThreeVertical } from "phosphor-react"
import useTopCollectors from "../../hooks/useTopCollectors"
import Section from "../Section"
import Collector, { CollectorSkeleton } from "./components/Collector"

const TopCollectors = () => {
  const { data, isValidating, error } = useTopCollectors()
  const top3Collectors = data?.topCollectors?.slice(0, 3)
  const restCollectors = data?.topCollectors?.slice(0, 24).slice(3)

  return (
    <Section
      title="Top collectors"
      titleRightElement={
        data && (
          <Tag minW="max-content" position="relative" top={1}>
            {new Intl.NumberFormat("en", {
              notation: "standard",
            }).format(data.uniqueCollectors)}
          </Tag>
        )
      }
    >
      {error ? (
        <Text w="full" colorScheme="gray">
          Couldn't fetch top collectors
        </Text>
      ) : !data || isValidating ? (
        <SimpleGrid
          pt={2}
          w="full"
          columns={{ base: 3, sm: 4, lg: 6, xl: 8 }}
          columnGap={2}
          rowGap={4}
        >
          {[...Array(100)].map((_, i) => (
            <CollectorSkeleton key={i} />
          ))}
        </SimpleGrid>
      ) : (
        <>
          <SimpleGrid
            pt={2}
            w="full"
            columns={{ base: 3, sm: 4, lg: 6, xl: 8 }}
            columnGap={2}
            rowGap={4}
          >
            {top3Collectors.map((address) => (
              <Collector key={address} address={address} />
            ))}
            {restCollectors.map((address) => (
              <Collector key={address} address={address} />
            ))}
          </SimpleGrid>

          <Flex justifyContent="center">
            <Icon as={DotsThreeVertical} color="gray" boxSize={6} />
          </Flex>

          <Text
            colorScheme="gray"
            fontWeight="bold"
            fontFamily="display"
            textAlign="center"
          >
            {`${new Intl.NumberFormat("en", {
              notation: "standard",
            }).format(data.uniqueCollectors - 50)} more`}
          </Text>
        </>
      )}
    </Section>
  )
}

export default TopCollectors
