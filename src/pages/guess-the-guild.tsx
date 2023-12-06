import {
  Card,
  Container,
  Heading,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import Layout from "components/common/Layout"

const GuessTheGuild = (): JSX.Element => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a")
  const bgOpacity = useColorModeValue(0.06, 0.1)
  const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })

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
          <Card mt="0px" py="7" px="4">
            <Heading
              as="h2"
              mb="3"
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              textAlign="center"
              fontFamily="display"
            >
              GuildGesser 1.0
            </Heading>
            <Text textAlign="center">
              Are you an expert on Guilds? <br /> Test your knowledge in our guild
              guesser mini game!
            </Text>
          </Card>
        </Container>
      </Layout>
    </>
  )
}

export default GuessTheGuild
