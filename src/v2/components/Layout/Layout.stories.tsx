import type { Meta, StoryFn } from "@storybook/react"
import { ThemeProvider } from "next-themes"
import {
  Layout,
  LayoutBanner,
  LayoutFooter,
  LayoutHeadline,
  LayoutHero,
  LayoutMain,
} from "."
import { NavMenu } from "../Header/NavMenu"
import { LayoutTitle } from "./Layout"

const meta: Meta = {
  title: "Guild UI/Layout",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta

export const Static: StoryFn = () => (
  <Layout>
    <LayoutHero>
      <LayoutBanner />
      <header className="relative flex h-16 w-full items-center justify-between p-2">
        <NavMenu />
      </header>
      <LayoutHeadline>
        <div className="size-20 rounded-full bg-background"></div>
        <LayoutTitle>Layout title</LayoutTitle>
      </LayoutHeadline>
    </LayoutHero>
    <LayoutMain>Page contents</LayoutMain>
    <LayoutFooter />
  </Layout>
)
