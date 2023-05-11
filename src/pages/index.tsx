import { Box, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CallToAction from "components/index/CallToAction"
import ComposableRequirements from "components/index/ComposableRequirements"
import Discover from "components/index/Discover"
import ExploreTrendingGuilds from "components/index/ExploreTrendingGuilds"
import Footer from "components/index/Footer"
import GuildValues from "components/index/GuildValues"
import Hero from "components/index/Hero"
import PlatformAgnosticCommunities from "components/index/PlatformAgnosticCommunities"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Page = (): JSX.Element => {
  const { account } = useWeb3React()
  const router: any = useRouter()
  const hasNavigated = router.components && Object.keys(router.components).length > 2
  const { triedEager } = useWeb3ConnectionManager()

  useEffect(() => {
    if (router.isReady && !hasNavigated && triedEager && account)
      router.push("/explorer")
  }, [hasNavigated, account, triedEager, router])

  // Setting up the dark mode, because this is a "static" page
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  return (
    <>
      <LinkPreviewHead path="" />
      <Head>
        <title>Guild</title>
        <meta name="og:title" content="Guild" />
        <meta
          name="description"
          content="Automated membership management for the platforms your community already uses."
        />
        <link rel="shortcut icon" href="/guild-icon.png" />
      </Head>

      <Box
        as="main"
        position="relative"
        bgColor="gray.800"
        h="100vh"
        justifyContent="start"
        overflowX="hidden"
        overflowY="scroll"
        sx={{
          perspective: "2px",
          transformStyle: "preserve-3d",
          scrollBehavior: "smooth",
        }}
      >
        <Hero />
        <Box bgColor="gray.800" sx={{ transformStyle: "preserve-3d" }}>
          <PlatformAgnosticCommunities />
          <ComposableRequirements />
          <ExploreTrendingGuilds />
          <GuildValues />
          <Discover />
        </Box>
        <CallToAction />
        <Footer />
      </Box>
    </>
  )
}

export default Page
