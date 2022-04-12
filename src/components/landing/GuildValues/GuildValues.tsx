import { GridItem, SimpleGrid, Text } from "@chakra-ui/react"
import LandingWideSection from "../LandingWideSection"
import ValueCard from "./components/ValueCard"

const valueCards = [
  {
    title: "Dedicated support",
    content: (
      <Text fontFamily="display">
        You can count on us. There are no <br />
        silly questions here. We can help <br />
        you start, secure and scale.
      </Text>
    ),
    image: "/landing/ghost.svg",
  },
  {
    title: "Open-source",
    content: (
      <Text fontFamily="display">
        Our frontend and platfrom <br />
        connectors are available <br />
        for anyone.
      </Text>
    ),
    image: "/landing/doll.svg",
  },
  {
    title: "API/SDK",
    content: (
      <Text fontFamily="display">
        Be creative and build on <br />
        Guild's access control <br />
        strategies.
      </Text>
    ),
    image: "/landing/fox.svg",
  },
  {
    title: "Accessible",
    content: (
      <Text fontFamily="display">
        Guild is for everyone. It's a no-
        <br />
        code tool with smooth user <br />
        experience.
      </Text>
    ),
    image: "/landing/walker.svg",
  },
]

const GuildValues = (): JSX.Element => (
  <LandingWideSection title="Guild values">
    <SimpleGrid columns={2} gap={{ base: 12, lg: 16 }}>
      {valueCards.map((card) => (
        <GridItem key={card.title} colSpan={{ base: 2, lg: 1 }}>
          <ValueCard title={card.title} content={card.content} image={card.image} />
        </GridItem>
      ))}
    </SimpleGrid>
  </LandingWideSection>
)

export default GuildValues
