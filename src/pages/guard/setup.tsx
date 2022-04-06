import { SimpleGrid } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import DCServerCard from "components/guard/setup/DCServerCard"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useSWR from "swr"

const Page = (): JSX.Element => {
  const router = useRouter()
  const dynamicTitle = "Select a server"

  const { data: servers } = useSWR("usersServers", null, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  })

  useEffect(() => {
    if (router.isReady && !Array.isArray(servers)) {
      router.push("/guard")
    }
  }, [servers, router])

  return (
    <Layout title={dynamicTitle}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, md: 6 }}>
        {(servers ?? []).map((serverData) => (
          <DCServerCard key={serverData.value} serverData={serverData} />
        ))}
      </SimpleGrid>
    </Layout>
  )
}

export default Page
