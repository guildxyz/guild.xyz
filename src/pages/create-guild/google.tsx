import { WithRumComponentContext } from "@datadog/rum-react-integration"
import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useUser from "components/[guild]/hooks/useUser"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildFormType, PlatformType } from "types"
import getRandomInt from "utils/getRandomInt"

const defaultValues: GuildFormType = {
  name: "",
  description: "",
  imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
  guildPlatforms: [
    {
      platformName: "GOOGLE",
      platformGuildId: "",
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

const CreateGuildGooglePage = (): JSX.Element => {
  const router = useRouter()

  const user = useUser()
  const googleFromDb = user?.platformUsers?.some(
    (platformUser) => platformUser.platformId === PlatformType.GOOGLE
  )

  useEffect(() => {
    if (!googleFromDb) {
      router.push("/create-guild")
    }
  }, [googleFromDb])

  const methods = useForm<GuildFormType>({ mode: "all", defaultValues })

  return (
    <Layout title="Create Guild for Google Workspaces">
      <FormProvider {...methods}>
        <GoogleGuildSetup />
        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </Layout>
  )
}

export default WithRumComponentContext(
  "Create Google guild page",
  CreateGuildGooglePage
)
