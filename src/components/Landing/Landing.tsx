import { Box } from "@chakra-ui/react"
import Head from "next/head"
import CallToAction from "./components/CallToAction"
import ComposableRequirements from "./components/ComposableRequirements"
import Discover from "./components/Discover"
import ExploreTrendingGuilds from "./components/ExploreTrendingGuilds"
import Footer from "./components/Footer"
import GuardAgainstPhishingAttack from "./components/GuardAgainstPhishingAttack"
import GuildValues from "./components/GuildValues"
import Hero from "./components/Hero"
import PlatformAgnosticCommunities from "./components/PlatformAgnosticCommunities"
import RealTimeQueryEngine from "./components/RealTimeQueryEngine"
import TokenBasedMembership from "./components/TokenBasedMembership"

const Landing = (): JSX.Element => (
  <>
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
      className="custom-scrollbar"
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

export default Landing
