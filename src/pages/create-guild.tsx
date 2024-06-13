import { ThemeProvider } from "components/[guild]/ThemeContext"
import { Layout } from "components/common/Layout"
import { CreateGuildProvider } from "components/create-guild/CreateGuildContext"
import { CreateGuildMainSection } from "components/create-guild/CreateGuildMainSection"
import { useWatch } from "react-hook-form"
import { useThemeContext } from "components/[guild]/ThemeContext"
import GuildLogo from "components/common/GuildLogo"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"

function CreateGuildHead() {
  const name = useWatch({ name: "name" })
  const imageUrl = useWatch({ name: "imageUrl" })

  return <Layout.Head ogTitle={name || "Create Guild"} imageUrl={imageUrl} />
}

function CreateGuildBackground() {
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const { localThemeColor, localBackgroundImage } = useThemeContext()
  const themeColor = useWatch({ name: "theme.color" })
  const color = localThemeColor !== themeColor ? themeColor : localThemeColor

  return (
    <Layout.Background offset={47} background={color} image={localBackgroundImage} />
  )
}

function CreateGuildHeadline() {
  const name = useWatch({ name: "name" })
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
  const { control } = useFormContext<GuildFormType>()
  return <DynamicDevTool control={control} />
}

const CreateGuildPage = (): JSX.Element => (
  <>
    <Layout.Root>
      <CreateGuildHead />
      <Layout.HeaderSection>
        <CreateGuildBackground />
        <Layout.Header />
        <CreateGuildHeadline />
      </Layout.HeaderSection>
      <CreateGuildMainSection />
    </Layout.Root>
    <CreateGuildDynamicDevTool />
  </>
)

const CreateGuildPageWrapper = (): JSX.Element => (
  <CreateGuildProvider>
    <ThemeProvider>
      <CreateGuildPage />
    </ThemeProvider>
  </CreateGuildProvider>
)

export default CreateGuildPageWrapper
