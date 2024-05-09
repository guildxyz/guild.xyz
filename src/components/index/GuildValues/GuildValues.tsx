import { GridItem, SimpleGrid } from "@chakra-ui/react"
import LandingWideSection from "../LandingWideSection"
import ValueCard from "./components/ValueCard"
import ValueText from "./components/ValueText"

const valueCards = [
  {
    link: "https://discord.gg/KUkghUdk2G",
    title: "Dedicated support",
    content: (
      <ValueText>
        You can count on us. There are no <br />
        silly questions here. We can help <br />
        you start, secure and scale.
      </ValueText>
    ),
    image: "/landing/ghost.svg",
  },
  {
    link: "https://github.com/guildxyz/guild.xyz",
    title: "Open-source",
    content: (
      <ValueText>
        Our frontend and platform <br />
        connectors are available <br />
        for anyone.
      </ValueText>
    ),
    image: "/landing/fox.svg",
  },
  {
    link: "https://docs.guild.xyz/guild/guild-api-alpha",
    title: "API/SDK",
    content: (
      <ValueText>
        Be creative and build on <br />
        Guild's access control <br />
        strategies.
      </ValueText>
    ),
    image: "/landing/guild-dude.svg",
  },
  {
    link: "/create-guild",
    title: "Accessible",
    content: (
      <ValueText>
        Guild is for everyone. It's a no-
        <br />
        code tool with smooth user <br />
        experience.
      </ValueText>
    ),
    image: "/landing/guild-guy.svg",
  },
]

const GuildValues = (): JSX.Element => (
  <LandingWideSection title="Guild values">
    <SimpleGrid columns={2} gap={{ base: 6, lg: 8 }}>
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
