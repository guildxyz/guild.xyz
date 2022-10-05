import { Text } from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import Layout from "components/common/Layout"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { useRouter } from "next/router"

const CreateGuildPage = (): JSX.Element => {
  const router = useRouter()

  return (
    <Layout title="Choose platform">
      <Text colorScheme={"gray"} fontSize="lg" fontWeight="semibold" mt="-8" mb="10">
        You can connect more platforms later
      </Text>
      <PlatformsGrid
        onSelection={(selectedPlatform) =>
          router.push(`/create-guild/${selectedPlatform.toLowerCase()}`)
        }
      />
    </Layout>
  )
}

export default WithRumComponentContext("Create guild index page", CreateGuildPage)
