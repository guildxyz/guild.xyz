import { Container, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import AssignLogos from "components/guess-the-guild/AssignLogos"
import ScoreIndicator from "components/guess-the-guild/ScoreIndicator"
import { GuildBase } from "types"

const GuessTheGuild = (): JSX.Element => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a")
  const bgOpacity = useColorModeValue(0.06, 0.1)
  const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })

  const mockGuilds: GuildBase[] = [
    {
      id: 1,
      name: "Guild1",
      urlName: "guild1",
      imageUrl: "",
      roles: ["role1", "role2"],
      platforms: ["DISCORD"],
      memberCount: 12,
      rolesCount: 2,
      tags: ["FEATURED", "VERIFIED"],
    },
    {
      id: 2,
      name: "Guild2",
      urlName: "guild1",
      imageUrl: "",
      roles: ["role1", "role2"],
      platforms: ["DISCORD"],
      memberCount: 12,
      rolesCount: 2,
      tags: ["FEATURED", "VERIFIED"],
    },
    {
      id: 3,
      name: "Guild3",
      urlName: "guild1",
      imageUrl: "",
      roles: ["role1", "role2"],
      platforms: ["DISCORD"],
      memberCount: 12,
      rolesCount: 2,
      tags: ["FEATURED", "VERIFIED"],
    },
    {
      id: 4,
      name: "Guild4",
      urlName: "guild1",
      imageUrl: "",
      roles: ["role1", "role2"],
      platforms: ["DISCORD"],
      memberCount: 12,
      rolesCount: 2,
      tags: ["FEATURED", "VERIFIED"],
    },
  ]

  return (
    <>
      <Layout
        ogTitle={"Mini Game"}
        ogDescription="Are you an expert on Guilds? Test your knowledge!"
        background={bgColor}
        backgroundProps={{
          opacity: 1,
          _before: {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            bg: `linear-gradient(to top right, ${bgColor} ${bgLinearPercentage}, transparent), url('/banner.png ')`,
            bgSize: { base: "auto 100%", sm: "auto 115%" },
            bgRepeat: "no-repeat",
            bgPosition: "top 10px right 0px",
            opacity: bgOpacity,
          },
        }}
        backgroundOffset={200}
        textColor="white"
      >
        <Container p="0">
          <ScoreIndicator />
          <Card mt="0px" py="7" px="4">
            {/* <StartGame /> */}
            {/* <GuessName guilds={mockGuilds} /> */}
            <AssignLogos guilds={mockGuilds} />
            {/* <EndGame /> */}
          </Card>
        </Container>
      </Layout>
    </>
  )
}

export default GuessTheGuild
