import { ThemeProvider } from "components/[guild]/ThemeContext"
import { Layout } from "components/common/CompoundLayout"
import {
  BoundBackground,
  BoundContent,
  BoundDynamicDevTool,
  BoundHead,
  BoundHeadline,
} from "components/create-guild/BoundComponents"
import { CreateGuildProvider } from "components/create-guild/CreateGuildContext"

const CreateGuildPage = (): JSX.Element => (
  <>
    <Layout.Root>
      <BoundHead />
      <Layout.HeaderSection>
        <BoundBackground />
        <Layout.Header />
        <BoundHeadline />
      </Layout.HeaderSection>
      <Layout.MainSection>
        <BoundContent />
      </Layout.MainSection>
    </Layout.Root>
    <BoundDynamicDevTool />
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
