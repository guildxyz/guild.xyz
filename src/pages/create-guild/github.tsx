import GitHubGuildSetup from "components/common/GitHubGuildSetup"
import Layout from "components/common/Layout"
import useUser from "components/[guild]/hooks/useUser"
import { useRouter } from "next/router"
import { useEffect } from "react"

const CreateGithubGuild = () => {
  const { platformUsers } = useUser()
  const isGithubConnected = platformUsers?.some(
    ({ platformName }) => platformName === "GITHUB"
  )
  const router = useRouter()

  useEffect(() => {
    if (platformUsers !== undefined && isGithubConnected === false) {
      router.push("/create-guild")
    }
  }, [platformUsers, isGithubConnected])

  return (
    <Layout title="Create Guild on GitHub">
      <GitHubGuildSetup />
    </Layout>
  )
}

export default CreateGithubGuild
