import { ThemeProvider } from "components/[guild]/ThemeContext"
import { Layout } from "components/common/Layout"
import { CreateGuildBackground } from "components/create-guild/CreateGuildBackground"
import { CreateGuildProvider } from "components/create-guild/CreateGuildContext"
import { CreateGuildDynamicDevTool } from "components/create-guild/CreateGuildDynamicDevTool"
import { CreateGuildHead } from "components/create-guild/CreateGuildHead"
import { CreateGuildHeadline } from "components/create-guild/CreateGuildHeadline"
import { CreateGuildMainSection } from "components/create-guild/CreateGuildMainSection"

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
