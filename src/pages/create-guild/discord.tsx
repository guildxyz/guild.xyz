import { Text } from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"

const defaultValues = {
  imageUrl: "/guildLogos/0.svg",
  platform: "DISCORD",
  DISCORD: {
    platformId: undefined,
  },
  requirements: [
    {
      type: "FREE",
    },
  ],
}

const CreateDiscordGuildPage = (): JSX.Element => {
  const router = useRouter()

  const { authorization } = useDCAuth("guilds")

  useEffect(() => {
    if (!authorization) {
      router.push("/create-guild")
    }
  }, [authorization])

  const methods = useForm({ mode: "all", defaultValues })

  const selectedServer = useWatch({
    control: methods.control,
    name: "DISCORD.platformId",
  })

  return (
    <Layout title="Create Guild on Discord">
      <FormProvider {...methods}>
        <DiscordGuildSetup
          filterServers={true}
          {...{ defaultValues, selectedServer }}
        >
          <Text>TODO: gif</Text>
        </DiscordGuildSetup>

        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </Layout>
  )
}

export default WithRumComponentContext(
  "Create Discord guild page",
  CreateDiscordGuildPage
)
