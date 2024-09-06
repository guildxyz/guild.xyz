import { Header } from "@/components/Header"
import { Layout, LayoutBanner, LayoutHero, LayoutMain } from "@/components/Layout"
import { Card } from "@/components/ui/Card"
import svgToTinyDataUri from "mini-svg-data-uri"
import type { Metadata } from "next"
import { PropsWithChildren, Suspense } from "react"

export const metadata: Metadata = {
  title: "Create profile",
  description:
    "Start your new profile adventure by signing in: earn experience, display achievements and explore new rewards!",
}

const CreateProfile = ({ children }: PropsWithChildren) => {
  return (
    <Layout>
      <div
        className="-z-10 absolute inset-0 opacity-40 dark:opacity-60"
        style={{
          background: `radial-gradient(ellipse at center, transparent -250%, hsl(var(--background)) 80%), url("${svgToTinyDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#666"><path d="M0 .5H31.5V32"/></svg>`
          )}")`,
        }}
      />
      <LayoutHero className="pb-52">
        <LayoutBanner className="border-border-muted border-b border-dashed dark:bg-banner-dark">
          <div className="absolute inset-0 bg-[auto_115%] bg-[top_5px_right_0] bg-[url('/banner.svg')] bg-repeat opacity-5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,transparent_5%,var(--banner))] dark:bg-[radial-gradient(circle_at_bottom,transparent_5%,var(--banner-dark))]" />
        </LayoutBanner>

        <Header />
      </LayoutHero>
      <LayoutMain className="-top-40 sm:-top-36 px-0">
        <Card className="mx-auto max-w-max bg-gradient-to-b from-card to-card-secondary shadow-2xl">
          <Suspense>{children}</Suspense>
        </Card>
      </LayoutMain>
    </Layout>
  )
}

export default CreateProfile
