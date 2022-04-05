import { SimpleGrid } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import DCServerCard from "components/guard/setup/DCServerCard"

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
        {MOCK_SERVERS.map((serverData) => (
          <DCServerCard key={serverData.id} serverData={serverData} />
        ))}
      </SimpleGrid>
    </Layout>
  )
}

export default Page
