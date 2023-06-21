import { Heading, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { DotsThreeVertical } from "phosphor-react"
import useTopCollectors from "../../hooks/useTopCollectors"
import Collector, { CollectorSkeleton } from "./components/Collector"

const TopCollectors = () => {
  const { data, isValidating, error } = useTopCollectors()
  const top3Collectors = data?.topCollectors?.slice(0, 3)
  const restCollectors = data?.topCollectors?.slice(3)

  return (
    <Stack spacing={4} alignItems="center">
      <Heading w="full" as="h3" fontFamily="display" fontSize="2xl">
        Top collectors
      </Heading>

      {error ? (
        <Text w="full" colorScheme="gray">
          Couldn't fetch top collectors
        </Text>
      ) : !data || isValidating ? (
        <SimpleGrid
          pt={8}
          w="full"
          columns={{ base: 3, sm: 5, md: 3, xl: 5 }}
          gap={8}
        >
          {[...Array(100)].map((_, i) => (
            <CollectorSkeleton key={i} />
          ))}
        </SimpleGrid>
      ) : (
        <>
          <SimpleGrid
            pt={8}
            w="full"
            columns={{ base: 3, sm: 5, md: 3, xl: 5 }}
            gap={8}
          >
            {top3Collectors.map((address, index) => (
              <Collector key={address} address={address} index={index} />
            ))}
            {restCollectors.map((address) => (
              <Collector key={address} address={address} />
            ))}
          </SimpleGrid>

          <Icon as={DotsThreeVertical} color="gray" boxSize={8} />

          <Text
            colorScheme="gray"
            fontSize="xl"
            fontWeight="bold"
            fontFamily="display"
          >
            {`${new Intl.NumberFormat("en", {
              notation: "standard",
            }).format(data.uniqueCollectors - 100)} more`}
          </Text>
        </>
      )}
    </Stack>
  )
}

export default TopCollectors
