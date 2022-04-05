import { Button, Flex, Img, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"

const MOCK_SERVERS = [
  {
    id: 1,
    image:
      "https://cdn.discordapp.com/icons/948849405295992882/fad6dd845f131e682ed4c77e531a0f5f.png",
    name: "Johnny's Server",
  },
]

const Page = (): JSX.Element => {
  const dynamicTitle = "Select a server"

  return (
    <Layout title={dynamicTitle}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
        {MOCK_SERVERS.map((server) => (
          <Card position="relative" key={server.id}>
            <Img
              position="absolute"
              inset={0}
              w="full"
              src={server.image}
              alt={server.name}
              filter="blur(10px)"
              transform="scale(1.25)"
              opacity={0.5}
            />

            <Stack position="relative" direction="column" spacing={0}>
              <Flex py={8} alignItems="center" justifyContent="center">
                <Img
                  src={server.image}
                  alt={server.name}
                  borderRadius="full"
                  boxSize={28}
                />
              </Flex>

              <Stack
                maxW="full"
                direction="row"
                px={{ base: 5, sm: 6 }}
                pb={7}
                justifyContent="space-between"
                alignItems="center"
                spacing={4}
              >
                <Text
                  as="span"
                  isTruncated
                  fontFamily="display"
                  fontSize="xl"
                  fontWeight="bold"
                  letterSpacing="wide"
                >
                  {server.name}
                </Text>
                <Button h={10} colorScheme="DISCORD">
                  Setup
                </Button>
              </Stack>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Layout>
  )
}

export default Page
