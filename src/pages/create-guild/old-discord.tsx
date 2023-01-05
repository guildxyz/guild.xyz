import { Text } from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import DiscordGuildSetup from "components/common/DiscordGuildSetup/DiscordGuildSetup"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useIsConnected from "hooks/useIsConnected"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"

const defaultValues: GuildFormType = {
  name: "",
  description: "",
  imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
  guildPlatforms: [
    {
      platformName: "DISCORD",
      platformGuildId: "",
      platformGuildData: { inviteChannel: "" },
    },
  ],
  roles: [
    {
      name: "Member",
      logic: "AND",
      imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
      requirements: [{ type: "FREE" }],
      rolePlatforms: [
        {
          guildPlatformIndex: 0,
        },
      ],
    },
  ],
}

const CreateDiscordGuildPage = (): JSX.Element => {
  const router = useRouter()

  const isConnected = useIsConnected("DISCORD")

  useEffect(() => {
    if (!isConnected) {
      router.push("/create-guild")
    }
  }, [isConnected])

  const methods = useForm<GuildFormType>({ mode: "all", defaultValues })

  const selectedServer = useWatch({
    control: methods.control,
    name: "guildPlatforms.0.platformGuildId",
  })

  return (
    <Layout title="Create Guild on Discord">
      <Text colorScheme={"gray"} fontSize="lg" fontWeight="semibold" mt="-8" mb="10">
        Adding the bot and creating the Guild won't change anything on your server
        yet
      </Text>
      <FormProvider {...methods}>
        <DiscordGuildSetup
          {...{ defaultValues, selectedServer }}
          fieldName="guildPlatforms.0.platformGuildId"
        >
          <DiscordRoleVideo />
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
