import { ThemeProvider } from "components/[guild]/ThemeContext"
import { Layout } from "components/common/Layout"
import { CreateGuildBackground } from "components/create-guild/CreateGuildBackground"
import { CreateGuildContent } from "components/create-guild/CreateGuildContent"
import { CreateGuildProvider } from "components/create-guild/CreateGuildContext"
import { CreateGuildDynamicDevTool } from "components/create-guild/CreateGuildDynamicDevTool"
import { CreateGuildHead } from "components/create-guild/CreateGuildHead"
import { CreateGuildHeadline } from "components/create-guild/CreateGuildHeadline"

const CreateGuildPage = (): JSX.Element => (
  <>
    <Layout.Root>
      <CreateGuildHead />
      <Layout.HeaderSection>
        <CreateGuildBackground />
        <Layout.Header />
        <CreateGuildHeadline />
      </Layout.HeaderSection>
      <Layout.MainSection>
        <CreateGuildContent />
      </Layout.MainSection>
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
