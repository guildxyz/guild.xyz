import type { Meta, StoryFn } from "@storybook/react"
import { Layout } from "."

const meta: Meta = {
  title: "Design system/Layout",
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Static: StoryFn = () => (
  <Layout.Root>
    <Layout.Hero>
      <Layout.Banner />
      <Layout.Headline title="Layout title" />
    </Layout.Hero>
    <Layout.Main>Page contents</Layout.Main>
    <Layout.Footer />
  </Layout.Root>
)
