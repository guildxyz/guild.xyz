import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import GuildLogo from "components/common/GuildLogo"
import { Layout } from "components/common/Layout"
import CreateGuildForm, {
  CreateGuildFormType,
} from "components/create-guild/CreateGuildForm"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"

function CreateGuildHead() {
  const name = useWatch({ name: "name" })
  const imageUrl = useWatch({ name: "imageUrl" })

  return <Layout.Head ogTitle={name || "Create Guild"} imageUrl={imageUrl} />
}

function CreateGuildBackground() {
  const { localThemeColor, localBackgroundImage } = useThemeContext()
  const themeColor = useWatch({ name: "theme.color" })
  const color = localThemeColor !== themeColor ? themeColor : localThemeColor

  return (
    <Layout.Background offset={47} background={color} image={localBackgroundImage} />
  )
}

function CreateGuildHeadline() {
  const name = useWatch({ name: "name" })
  const { textColor } = useThemeContext()
  const imageUrl = useWatch({ name: "imageUrl" })

  return (
    <Layout.Headline
      title={name || "Create Guild"}
      image={
        imageUrl && (
          <GuildLogo
            imageUrl={imageUrl}
            size={{ base: "56px", lg: "72px" }}
            mt={{ base: 1, lg: 2 }}
            bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
          />
        )
      }
    />
  )
}

function CreateGuildDynamicDevTool() {
  const { control } = useFormContext<CreateGuildFormType>()
  return <DynamicDevTool control={control} />
}

const CreateGuildPage = (): JSX.Element => {
  const methods = useForm<CreateGuildFormType>({
    mode: "all",
    defaultValues: {
      name: "",
      imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
      contacts: [
        {
          type: "EMAIL",
          contact: "",
        },
      ],
    },
  })

  return (
    <FormProvider {...methods}>
      <Layout.Root maxWidth="sizes.xl">
        <CreateGuildHead />
        <Layout.HeaderSection>
          <CreateGuildBackground />
          <Layout.Header />
          <CreateGuildHeadline />
        </Layout.HeaderSection>

        <Layout.MainSection>
          <CreateGuildForm />
        </Layout.MainSection>
      </Layout.Root>
      <CreateGuildDynamicDevTool />
    </FormProvider>
  )
}

const CreateGuildPageWrapper = (): JSX.Element => (
  <ThemeProvider>
    <CreateGuildPage />
  </ThemeProvider>
)

export default CreateGuildPageWrapper
