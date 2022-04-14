import { GridItem, SimpleGrid, Text } from "@chakra-ui/react"
import LandingWideSection from "../LandingWideSection"
import ValueCard from "./components/ValueCard"

const valueCards = [
  {
    link: "https://discord.gg/guildxyz",
    title: "Dedicated support",
    content: (
      <Text>
        You can count on us. There are no <br />
        silly questions here. We can help <br />
        you start, secure and scale.
      </Text>
    ),
    image: "/landing/ghost.svg",
  },
  {
    link: "https://github.com/agoraxyz/guild.xyz",
    title: "Open-source",
    content: (
      <Text>
        Our frontend and platfrom <br />
        connectors are available <br />
        for anyone.
      </Text>
    ),
    image: "/landing/fox.svg",
  },
  {
    link: "https://docs.guild.xyz/guild/guild-api-alpha",
    title: "API/SDK",
    content: (
      <Text>
        Be creative and build on <br />
        Guild's access control <br />
        strategies.
      </Text>
    ),
    image: "/landing/guild-dude.svg",
  },
  {
    link: "/create-guild",
    title: "Accessible",
    content: (
      <Text>
        Guild is for everyone. It's a no-
        <br />
        code tool with smooth user <br />
        experience.
      </Text>
    ),
    image: "/landing/guild-guy.svg",
  },
]

const GuildValues = (): JSX.Element => (
  <LandingWideSection title="Guild values">
    <SimpleGrid columns={2} gap={{ base: 12, lg: 16 }}>
      {valueCards.map((card) => (
        <GridItem key={card.title} colSpan={{ base: 2, lg: 1 }}>
          <ValueCard
            link={card.link}
            title={card.title}
            content={card.content}
            image={card.image}
          />
        </GridItem>
      ))}
    </SimpleGrid>
  </LandingWideSection>
)

export default GuildValues
