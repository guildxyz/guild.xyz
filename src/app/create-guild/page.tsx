import { ConfettiProvider } from "@/components/Confetti"
import { Header } from "@/components/Header"
import { Layout, LayoutBanner, LayoutHero, LayoutMain } from "@/components/Layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { Dialog } from "@/components/ui/Dialog"
import svgToTinyDataUri from "mini-svg-data-uri"
import { CreateGuildCard } from "./_components/CreateGuildCard"
import { CreateGuildFormProvider } from "./_components/CreateGuildFormProvider"

export const metadata = {
  title: "Begin your guild",
}

const Page = () => (
  <CreateGuildFormProvider>
    <ConfettiProvider>
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

        <LayoutMain className="-top-40 sm:-top-36 max-w-lg px-0">
          <CreateGuildCard />

          <p className="mx-auto my-4 text-center">or</p>

          <Card
            className="mt-4 flex flex-col items-center justify-center p-12 shadow-lg md:px-6"
            style={{
              background:
                "linear-gradient(120deg, rgba(243, 183, 150, 0.1) 1.83%, rgba(0, 0, 0, 0.05) 52.14%, rgba(139, 122, 147, 0.1) 100.55%), #121213",
            }}
          >
            <div className="relative mx-auto w-fit">
              <h1 className="absolute top-0 left-0 z-0 whitespace-nowrap bg-gradient-to-r from-[#F3B796] to-[#8B7A93] bg-clip-text text-center font-bold font-display text-4xl text-transparent blur-2xl">
                Guild Alpha
              </h1>
              <h1 className="absolute top-0 left-0 z-0 whitespace-nowrap bg-gradient-to-r from-[#F3B796] to-[#8B7A93] bg-clip-text text-center font-bold font-display text-4xl text-transparent blur-xl">
                Guild Alpha
              </h1>
              <h1 className="absolute top-0 left-0 z-0 whitespace-nowrap bg-gradient-to-r from-[#F3B796] to-[#8B7A93] bg-clip-text text-center font-bold font-display text-4xl text-transparent blur-sm">
                Guild Alpha
              </h1>
              <h1 className="absolute top-0 left-0 z-10 whitespace-nowrap text-center font-bold font-display text-4xl text-white">
                Guild Alpha
              </h1>
              <h1 className="z-10 whitespace-nowrap text-center font-bold font-display text-4xl text-white">
                Guild Alpha
              </h1>
            </div>

            <p className="mt-1 text-center font-semibold text-white">
              Snappier. Faster. Smoother.
            </p>

            <p className="mt-4 mb-4 text-center text-white/50">
              Want to create a guild on our updated platform? Apply for alpha.
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="mt-4 bg-white text-black hover:bg-white/90 active:bg-white/80"
                  size="lg"
                >
                  Apply now
                </Button>
              </DialogTrigger>
              <DialogContent size="3xl" className="overflow-hidden">
                <DialogTitle />
                <iframe
                  title="Application Form"
                  src="https://guildxyz.notion.site/ebd/1c7d63dda005805d8084de02bd37ae32"
                  width="100%"
                  height="600"
                  allowFullScreen
                />
              </DialogContent>
            </Dialog>
          </Card>
        </LayoutMain>
      </Layout>
    </ConfettiProvider>
  </CreateGuildFormProvider>
)

export default Page
