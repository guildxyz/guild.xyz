import { HStack, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { PlatformName } from "types"
import pluralize from "utils/pluralize"
import { SolutionCardData, SolutionName } from "../types"
import SolutionCard from "./SolutionCard"

const Category = ({
  heading,
  items,
  onSelectReward,
  onSelectSolution,
  searchQuery,
}: {
  heading: string
  items: SolutionCardData[]
  onSelectReward: (reward: PlatformName) => void
  onSelectSolution: (solution: SolutionName) => void
  searchQuery?: string
}) => {
  const filteredItems = items.filter((item) =>
    !!searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase())
      : item
  )

  return (
    <>
      <section>
        <HStack mb={3}>
          <Heading
            as="h2"
            color={"GrayText"}
            fontSize={"xs"}
            fontWeight={"bold"}
            textTransform={"uppercase"}
          >
            {heading}
          </Heading>
          {!!searchQuery && (
            <Text colorScheme="gray" fontWeight={"normal"} fontSize={"xs"}>
              ({pluralize(filteredItems.length, "result", true)})
            </Text>
          )}
        </HStack>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={{ base: 2, md: 3 }}
          mb={filteredItems.length === 0 ? 2 : 8}
        >
          {filteredItems.map((item) => (
            <CardMotionWrapper key={item.title}>
              <SolutionCard
                {...item}
                onClick={
                  item.handlerType === "reward"
                    ? () => onSelectReward(item.handlerParam as PlatformName)
                    : () => onSelectSolution(item.handlerParam as SolutionName)
                }
              />
            </CardMotionWrapper>
          ))}
        </SimpleGrid>
      </section>
    </>
  )
}

export default Category
