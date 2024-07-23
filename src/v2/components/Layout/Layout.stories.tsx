import type { Meta, StoryFn } from "@storybook/react"
import {
  Layout,
  LayoutBanner,
  LayoutFooter,
  LayoutHeadline,
  LayoutHero,
  LayoutMain,
} from "."
import { LayoutBannerBackground } from "./Layout"

const meta: Meta = {
  title: "Design system/Layout",
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

export const Static: StoryFn = () => (
  <Layout>
    <LayoutHero>
      <LayoutBanner>
        <LayoutBannerBackground />
      </LayoutBanner>
      <LayoutHeadline title="Layout title" />
    </LayoutHero>
    <LayoutMain>Page contents</LayoutMain>
    <LayoutFooter />
  </Layout>
)
