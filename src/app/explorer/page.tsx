"use client"

import { PropsWithChildren } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/Button"
import { Plus } from "@phosphor-icons/react"
import { SignIn, MagnifyingGlass, PushPin, Sparkle } from "phosphor-react"
import Robot from "/public/landing/robot.svg"
import { Input } from "@/components/ui/input"

function PageBoundary({ children }: PropsWithChildren) {
  return <div className="mx-auto max-w-screen-lg">{children}</div>
}

const Page = () => {
  console.log("explorer")
  return (
    <div className="min-h-screen">
      <header className="h-16 outline">header</header>
      <PageBoundary>
        <div className="my-16">
          <h1 className="font-display text-5xl font-bold">Guildhall</h1>
        </div>
        <main>
          <div className="flex items-start justify-between my-4">
            <ToggleGroup type="single" className="space-x-2">
              <ToggleGroupItem value="your-guilds">Your guilds</ToggleGroupItem>
              <ToggleGroupItem value="explore-guilds">
                Explore guilds
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="ghost" className="space-x-2">
              <Plus />
              <span>Create guild</span>
            </Button>
          </div>
          <div className="font-medium p-6 my-2 bg-card rounded-lg flex justify-between items-center mb-12">
            <div className="flex gap-4 items-center">
              <Robot className="size-8" />
              <span>Sign in to view your guilds / create new ones</span>
            </div>
            <Button className="space-x-2" size="lg">
              <SignIn />
              <span className="text-md font-semibold">Sign in</span>
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h2 className="text-lg font-bold">Explore verified guilds</h2>
            <div className="relative flex">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 stroke-muted" />
              <Input
                className="text-md py-6 pr-6 pl-12 rounded-r-none grow"
                placeholder="Search verified guilds"
              />
              <ToggleGroup
                type="single"
                className="bg-card px-4 rounded-r-lg border"
              >
                <ToggleGroupItem value="featured" className="space-x-2">
                  <PushPin />
                  <span>featured</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="newest" className="space-x-2">
                  <Sparkle />
                  <span>newest</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </main>
      </PageBoundary>
    </div>
  )
}

export default Page

// import { useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
// import ClientOnly from "components/common/ClientOnly"
// import Layout from "components/common/Layout"
// import LinkPreviewHead from "components/common/LinkPreviewHead"
// import ExploreAllGuilds from "components/explorer/ExploreAllGuilds"
// import ExplorerTabs from "components/explorer/ExplorerTabs"
// import GoToCreateGuildButton from "components/explorer/GoToCreateGuildButton"
// import YourGuilds, { useYourGuilds } from "components/explorer/YourGuilds"
// import useScrollRestoration from "components/explorer/hooks/useScrollRestoration"
// import { atom, useAtom } from "jotai"
// import { GetStaticProps } from "next"
// import { useRef } from "react"
// import { GuildBase } from "types"
// import fetcher from "utils/fetcher"
//
// type Props = {
//   guilds: GuildBase[]
// }
//
// export const explorerScrollRestorationAtom = atom(true)
//
// const Page = ({ guilds: guildsInitial }: Props): JSX.Element => {
//   const yourGuildsRef = useRef(null)
//   const allGuildsRef = useRef(null)
//
//   const { data: usersGuilds } = useYourGuilds()
//
//   const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a") // dark color is from whiteAlpha.200, but without opacity so it can overlay the banner image
//   const bgOpacity = useColorModeValue(0.06, 0.1)
//   const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })
//   const [shouldRestoreScroll, setShouldRestoreScroll] = useAtom(
//     explorerScrollRestorationAtom
//   )
//
//   useScrollRestoration({
//     active: shouldRestoreScroll,
//     onRestore: () => setShouldRestoreScroll(true),
//   })
//
//   return (
//     <>
//       <LinkPreviewHead path="" />
//       <Layout
//         title={"Guildhall"}
//         ogDescription="Automated membership management for the platforms your community already uses."
//         background={bgColor}
//         backgroundProps={{
//           opacity: 1,
//           _before: {
//             content: '""',
//             position: "absolute",
//             top: 0,
//             bottom: 0,
//             left: 0,
//             right: 0,
//             bg: `linear-gradient(to top right, ${bgColor} ${bgLinearPercentage}, transparent), url('/banner.png ')`,
//             bgSize: { base: "auto 100%", sm: "auto 115%" },
//             bgRepeat: "no-repeat",
//             bgPosition: "top 10px right 0px",
//             opacity: bgOpacity,
//           },
//         }}
//         backgroundOffset={usersGuilds?.length ? 135 : 120}
//         textColor="white"
//       >
//         <ClientOnly>
//           <ExplorerTabs
//             {...{ yourGuildsRef, allGuildsRef }}
//             rightElement={usersGuilds?.length && <GoToCreateGuildButton />}
//           />
//           <YourGuilds ref={yourGuildsRef} />
//         </ClientOnly>
//
//         <ExploreAllGuilds ref={allGuildsRef} {...{ guildsInitial }} />
//       </Layout>
//     </>
//   )
// }
//
// export const getStaticProps: GetStaticProps = async () => {
//   const guilds = await fetcher(`/v2/guilds?sort=members`).catch((_) => [])
//
//   return {
//     props: { guilds },
//     revalidate: 300,
//   }
// }
//
// export default Page
