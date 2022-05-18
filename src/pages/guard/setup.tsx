import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import EntryChannel from "components/create-guild/EntryChannel"
import Disclaimer from "components/guard/setup/ServerSetupCard/components/Disclaimer"
import PickSecurityLevel from "components/guard/setup/ServerSetupCard/components/PickSecurityLevel"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"

const defaultValues = {
  imageUrl: "/guildLogos/0.svg",
  platform: "DISCORD",
  isGuarded: true,
  DISCORD: {
    platformId: undefined,
  },
  channelId: undefined,
  grantAccessToExistingUsers: "false",
  requirements: [
    {
      type: "FREE",
    },
  ],
}

const Page = (): JSX.Element => {
  const router = useRouter()

  const { authorization } = useDCAuth("guilds")

  useEffect(() => {
    if (!authorization) {
      router.push("/guard")
    }
  }, [authorization])

  const methods = useFormContext()

  const selectedServer = useWatch({
    control: methods.control,
    name: "DISCORD.platformId",
  })

  const {
    data: { channels },
  } = useServerData(selectedServer, {
    refreshInterval: 0,
  })

  return (
    <Layout title={selectedServer ? "Set up Guild Guard" : "Select a server"}>
      <FormProvider {...methods}>
        <DiscordGuildSetup {...{ defaultValues, selectedServer }}>
          <EntryChannel
            channels={channels}
            label="Entry channel"
            tooltip={
              "Newly joined accounts will only see this channel with a join button in it by the Guild.xyz bot until they authenticate"
            }
            showCreateOption
            maxW="50%"
            size="lg"
          />

          <PickSecurityLevel />

          <Disclaimer />
        </DiscordGuildSetup>

        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </Layout>
  )
}

const WrappedPage = () => {
  // TODO: form type
  const methods = useForm<any>({
    mode: "all",
    defaultValues,
  })

  return (
    <FormProvider {...methods}>
      <Page />
    </FormProvider>
  )
}

export default WrappedPage
