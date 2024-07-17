import { Layout } from "@/components/Layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create profile",
}

const Page = () => {
  return (
    <Layout.Root>
      <Layout.Hero>
        <Layout.Header />
        <Layout.Headline title="Create profile" />
        <Layout.Banner>
          <div className="absolute inset-0 bg-[auto_115%] bg-[right_top_10px] bg-[url('/banner.svg')] bg-no-repeat opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-50% from-banner to-transparent" />
        </Layout.Banner>
      </Layout.Hero>

      <Layout.Main>main content</Layout.Main>
    </Layout.Root>
  )
}

// biome-ignore lint/style/noDefaultExport: page route
export default Page
