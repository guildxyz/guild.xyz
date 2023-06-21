import { Heading, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { DotsThreeVertical } from "phosphor-react"
import useTopMinters from "../../hooks/useTopMinters"
import Minter, { MinterSkeleton } from "./components/Minter"

const TopMinters = () => {
  const { data, isValidating, error } = useTopMinters()
  const top3Minters = data?.topMinters?.slice(0, 3)
  const restMinters = data?.topMinters?.slice(3)

  return (
    <Stack spacing={4} alignItems="center">
      <Heading w="full" as="h3" fontFamily="display" fontSize="2xl">
        Top minters
      </Heading>

      {error ? (
        <Text w="full" colorScheme="gray">
          Couldn't fetch top minters
        </Text>
      ) : !data || isValidating ? (
        <SimpleGrid
          pt={8}
          w="full"
          columns={{ base: 3, sm: 5, md: 3, xl: 5 }}
          gap={8}
        >
          {[...Array(100)].map((_, i) => (
            <MinterSkeleton key={i} />
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
            {top3Minters.map((address, index) => (
              <Minter key={address} address={address} index={index} />
            ))}
            {restMinters.map((address) => (
              <Minter key={address} address={address} />
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
            }).format(data.uniqueMinters - 100)} more`}
          </Text>
        </>
      )}
    </Stack>
  )
}

export default TopMinters
