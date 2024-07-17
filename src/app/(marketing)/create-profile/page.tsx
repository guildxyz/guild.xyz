import { Layout } from "@/components/Layout"
import svgToTinyDataUri from "mini-svg-data-uri"
import type { Metadata } from "next"
import { OnboardingStepper } from "./_components/OnboardingStepper"

export const metadata: Metadata = {
  title: "Create profile",
}

const Page = () => {
  return (
    <Layout.Root className="relative min-h-screen">
      <div
        className="-z-10 absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent -250%, hsl(var(--background)) 80%), url("${svgToTinyDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#666"><path d="M0 .5H31.5V32"/></svg>`
          )}")`,
        }}
      />
      <Layout.Hero>
        <Layout.Header />
        <Layout.Banner offset={206} className="border-border border-b border-dashed">
          <div className="absolute inset-0 bg-[auto_115%] bg-[top_5px_right_0] bg-[url('/banner.svg')] bg-repeat opacity-10" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at bottom, transparent 5%, hsl(var(--banner)))",
            }}
          />
        </Layout.Banner>
      </Layout.Hero>
      <Layout.Main>
        <div className="my-8">
          <OnboardingStepper />
        </div>
      </Layout.Main>
    </Layout.Root>
  )
}

export default Page
