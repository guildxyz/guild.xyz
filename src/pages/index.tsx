import { Box } from "@chakra-ui/react"
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
import Head from "next/head"

const Page = (): JSX.Element => (
  <>
    <LinkPreviewHead path="" />
    <Head>
      <title>Guild</title>
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
      <Hero />
      <Box bgColor="gray.800" sx={{ transformStyle: "preserve-3d" }}>
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

export default Page
