import { WithRumComponentContext } from "@datadog/rum-react-integration"
import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { FormProvider, useForm } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"

const defaultValues: GuildFormType = {
  name: "",
  description: "",
  imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
  theme: { color: "#3b82f6" },
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
  const methods = useForm<GuildFormType>({ mode: "all", defaultValues })

  return (
    <Layout title="Create Guild for Google Workspaces">
      <FormProvider {...methods}>
        <GoogleGuildSetup
          defaultValues={defaultValues}
          fieldNameBase="roles.0.rolePlatforms.0.platformRoleData."
          shouldSetName
          permissionField={"roles.0.rolePlatforms.0.platformRoleData.role"}
        />
        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </Layout>
  )
}

export default WithRumComponentContext(
  "Create Google guild page",
  CreateGuildGooglePage
)
