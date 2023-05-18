import {
  Container,
  Heading,
  SimpleGrid,
  Stack,
  useColorMode,
} from "@chakra-ui/react"
import LegoCard from "components/lego/LegoCard"
import Head from "next/head"
import { useEffect } from "react"

const Page = () => {
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  return (
    <>
      <Head>
        <title>Guild Lego</title>
        <meta name="og:title" content="Guild Lego" />
        <link rel="shortcut icon" href="/guild-icon.png" />
      </Head>

      <Container maxW={{ base: "container.sm", lg: "container.lg" }}>
        <Stack pt={16}>
          <Heading
            fontFamily="display"
            fontSize={{ base: "4xl", md: "5xl", lg: "7xl" }}
            textAlign="center"
            mb={{ base: 10, md: 20 }}
          >
            Guild Lego Assemblies
          </Heading>
          <SimpleGrid
            columns={{ lg: 2 }}
            spacing={{ base: "6", md: "8", lg: "10" }}
            flexGrow={1}
            pb={{ base: 10, md: 20 }}
          >
            <LegoCard
              href="/lego/ChristmasGuildRobotAssembly.pdf"
              img="/lego/christmas-guild-robot.png"
              name="Guild Robot"
              pieces={104}
            />
            <LegoCard
              href="/lego/BrandenburgGuildAssembly.pdf"
              img="/lego/brandenburg-guild.png"
              name="Brandenburg Guild"
              pieces={362}
            />
            <LegoCard
              href="/lego/ArcDeGuildAssembly.pdf"
              img="/lego/arc-de-guild.png"
              name="Arc de Guild"
              pieces={190}
            />
            <LegoCard
              href="/lego/LightGuildEmpireAssembly.pdf"
              img="/lego/guild-empire-light.png"
              name="Guild Empire"
              pieces={162}
            />
            <LegoCard
              href="/lego/DarkGuildEmpireAssembly.pdf"
              img="/lego/guild-empire-dark.png"
              name="Guild Empire"
              pieces={162}
            />
            <LegoCard
              href="/lego/GuildCastleAssembly.pdf"
              img="/lego/guild-castle.png"
              name="Guild Castle"
              pieces={59}
            />
            <LegoCard
              href="/lego/GuildDudeAssembly.pdf"
              img="/lego/guild-dude.png"
              name="Guild Dude"
              pieces={74}
            />
            <LegoCard
              href="/lego/GuildFoxAssembly.pdf"
              img="/lego/guild-fox.png"
              name="Guild Fox"
              pieces={58}
            />
            <LegoCard
              href="/lego/GuildGhostAssembly.pdf"
              img="/lego/guild-ghost.png"
              name="Guild Ghost"
              pieces={64}
            />
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  )
}

export default Page
