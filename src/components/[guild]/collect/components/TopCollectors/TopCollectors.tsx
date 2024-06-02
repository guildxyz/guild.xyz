import {
  Box,
  Divider,
  HStack,
  SimpleGrid,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Section from "components/common/Section"
import useTopCollectors from "../../hooks/useTopCollectors"
import { useCollectNftContext } from "../CollectNftContext"
import Collector, { CollectorSkeleton } from "./components/Collector"

const TopCollectors = () => {
  const { isLegacy } = useCollectNftContext()
  const { data, isValidating, error } = useTopCollectors()
  const shownCollectors = data?.topCollectors?.slice(0, 39)
  const bgColor = useColorModeValue(
    "var(--chakra-colors-gray-100)",
    "var(--chakra-colors-gray-800)"
  )

  return (
    <Section
      title="Top collectors"
      titleRightElement={
        data && (
          <Tag minW="max-content" position="relative">
            {new Intl.NumberFormat("en", {
              notation: "standard",
            }).format(data.uniqueCollectors)}
          </Tag>
        )
      }
      pos="relative"
      spacing={4}
    >
      {error ? (
        <Text w="full" colorScheme="gray">
          Couldn't fetch top collectors
        </Text>
      ) : isValidating ? (
        <SimpleGrid
          pt={2}
          w="full"
          columns={{ base: 3, sm: 4, lg: 6 }}
          columnGap={4}
          rowGap={5}
        >
          {[...Array(24)].map((_, i) => (
            <CollectorSkeleton key={i} />
          ))}
        </SimpleGrid>
      ) : data && !data.topCollectors.length ? (
        <Text w="full" colorScheme="gray">
          No collectors yet
        </Text>
      ) : (
        <>
          <SimpleGrid
            pt={2}
            w="full"
            columns={{ base: 3, sm: 4, lg: 6 }}
            columnGap={4}
            rowGap={5}
          >
            {shownCollectors.map(({ address, balance }) => (
              <Collector
                key={address}
                address={address}
                balance={!isLegacy && balance}
              />
            ))}
          </SimpleGrid>
          {shownCollectors?.length > 39 && (
            <>
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                height={60}
                bgGradient={`linear-gradient(to top, ${bgColor}, transparent)`}
                pointerEvents="none"
              />

              <HStack alignItems="center" spacing={4} zIndex="1">
                <Text
                  flex="1 0 auto"
                  colorScheme="gray"
                  fontWeight="semibold"
                  fontSize={"sm"}
                  textAlign="center"
                >
                  {`and ${new Intl.NumberFormat("en", {
                    notation: "standard",
                  }).format(Math.max(data.uniqueCollectors - 50, 0))} more`}
                </Text>
                <Divider borderStyle={"dotted"} borderBottomWidth={4} />
                <Text
                  flex="1 0 auto"
                  ml="auto"
                  colorScheme="gray"
                  fontWeight="semibold"
                  fontSize={"sm"}
                  textAlign="center"
                >
                  be the next one!
                </Text>
              </HStack>
            </>
          )}
        </>
      )}
    </Section>
  )
}

export default TopCollectors
