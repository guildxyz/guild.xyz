import { Box, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CallToAction from "components/index/CallToAction"
import ComposableRequirements from "components/index/ComposableRequirements"
import Discover from "components/index/Discover"
import ExploreTrendingGuilds from "components/index/ExploreTrendingGuilds"
import Footer from "components/index/Footer"
import GuardAgainstPhishingAttack from "components/index/GuardAgainstPhishingAttack"
import GuildValues from "components/index/GuildValues"
import Hero from "components/index/Hero"
import PlatformAgnosticCommunities from "components/index/PlatformAgnosticCommunities"
import RealTimeQueryEngine from "components/index/RealTimeQueryEngine"
import TokenBasedMembership from "components/index/TokenBasedMembership"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef } from "react"

const Page = (): JSX.Element => {
  const { account } = useWeb3React()
  const router: any = useRouter()
  const hasNavigated = router.components && Object.keys(router.components).length > 2
  const { triedEager } = useContext(Web3Connection)

  useEffect(() => {
    if (router.isReady && !hasNavigated && triedEager && account)
      router.push("/explorer")
  }, [hasNavigated, account, triedEager, router])

  // Setting up the dark mode, because this is a "static" page
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  const ref = useRef(null)

  const scrollToInfos = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <LinkPreviewHead path="" />
      <Head>
        <title>Guild</title>
        <meta name="og:title" content="Guild" />
        <meta
          name="description"
          content="Automated membership management for the platforms your community already use."
        />
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
        <Hero scrollToInfos={scrollToInfos} />
        <Box
          bgColor="gray.800"
          pt="20px"
          sx={{ transformStyle: "preserve-3d" }}
          ref={ref}
        >
          <PlatformAgnosticCommunities />
          <TokenBasedMembership />
          <GuardAgainstPhishingAttack />
          <RealTimeQueryEngine />
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
