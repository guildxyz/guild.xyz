import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { motion } from "framer-motion"
import Image from "next/image"
import { CaretDown } from "phosphor-react"
import { useState } from "react"
import LandingButton from "./LandingButton"
import LandingWideSection from "./LandingWideSection"

const MotionBox = motion(Box)

const openGraphData = [
  {
    url: "https://guild.mirror.xyz/A_hzlKfwleK5l3zkILJ6qlF98oE_h4kz_BofksjpaaA",
    image: "/landing/discover/guild-dd.webp",
    title: "Leveraging Guild For Member Onboarding",
    description:
      "Case Study on how to build onboarding processes that actually support members w/ Luan",
  },
  {
    url: "https://www.youtube.com/watch?v=1uy3kjhFTwI",
    image: "/landing/discover/requirements-roles-rewards.webp",
    title: "Requirements, Roles and Rewards",
    description:
      "How to create the best membership structures and access rules on multiple platforms automatically? Guild.xyz has got your back!",
  },
  {
    url: "https://mirror.xyz/nasheq.eth/OOxQoitCP8NQ_R7y5j0RPlfbBdEINvhPsjUDPQaJvpA",
    image: "/landing/discover/guild-evolves-platformless-memberships.webp",
    title: "Guild evolves: platformless memberships",
    description:
      'Less than a year ago Guild.xyz started as a simple tool to connect Ethereum with Discord for "token gating". Working with hundreds of online communities we\'ve witnessed how painful transition costs from and between web2 walled gardens kept them from their true potential. To change this, we are excited to introduce Guild as an infrastructure for platformless memberships.',
  },
  {
    url: "https://guild.mirror.xyz/ibeYLZX-wRXlUL1LzZ2sW1uvHHWtfYG4RPburF2PtEA",
    image: "/landing/discover/realize-the-earning-power-of-your-community.webp",
    title: "Realize the earning power of your community",
    description: "Fund ideas, membership, goods, events and perks.",
  },
  {
    url: "https://twitter.com/guildxyz/status/1661346936211865600",
    image: "/landing/discover/guild-pins.webp",
    title: "Pins are coming to Guilds near you!",
    description:
      "Your wallet is not just a wallet, it's a part of your identity on the internet, full of onchain memories of your experience, like Pins. 📌 Later in all Guilds, but for now only in special ones...",
  },
  {
    url: "https://blog.zetachain.com/guild-joins-zetachain-as-an-omnichain-dao-tooling-launch-partner-ed6fd766ecb4",
    image: "/landing/discover/guild-zetachain.webp",
    title: "Guild Joins ZetaChain as an Omnichain DAO Tooling Launch Partner",
    description:
      "Largest Guild ZetaChain expands its partnership with Guild.xyz to power cross-chain functionality across its network, including chain/token agnostic payments to DAOs. Claim your non-transferable Guild Pin (Guild's newest feature release) on ZetaChain now.",
  },
  {
    url: "https://guild-lego-explorer.vercel.app",
    image: "/landing/discover/guild-lego-explorer.webp",
    title: "Guild LEGO Explorer",
    description: "A unique 3D experience built with Three.js",
  },
  {
    url: "https://guild.mirror.xyz/BsyH1aLqdNzGz2-hFIy7ssuiJzmZ_-h8MrcjLfewTC4",
    image: "/landing/discover/intro-to-guild.webp",
    title: "Introduction to Guild.xyz",
    description:
      "Guild.xyz is the infrastructure for platformless access management. Create portable memberships, social structures around on- & off-chain requirements and build unique user journeys across apps!",
  },
]

const Discover = (): JSX.Element => {
  const { colorMode } = useColorMode()

  const [sectionHeight, setSectionHeight] = useState<"80vh" | "auto">("80vh")

  return (
    <LandingWideSection
      title="Discover tutorials & updates"
      position="relative"
      mb={-8}
    >
      <MotionBox
        position="relative"
        initial={{
          height: "80vh",
        }}
        animate={{ height: sectionHeight }}
        overflow="hidden"
      >
        <Box
          gap={{ base: 6, lg: 8 }}
          mt={{ base: -2, md: -4 }}
          sx={{
            columnCount: [1, 1, 2],
          }}
        >
          {openGraphData?.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              isExternal
              w="full"
              _hover={{ textDecoration: "none" }}
            >
              <Card
                role="group"
                my={{ base: 2, md: 3, lg: 4 }}
                w="full"
                _hover={{
                  bg: colorMode === "light" ? "gray.50" : "gray.600",
                }}
              >
                {link.image && (
                  <AspectRatio ratio={2} _groupHover={{ opacity: 0.8 }}>
                    <Image
                      layout="fill"
                      objectFit="cover"
                      src={link.image}
                      alt={link.title}
                    />
                  </AspectRatio>
                )}
                <Stack px={{ base: 5, sm: 6 }} py={7}>
                  <Heading as="h4" fontSize="xl" fontFamily="display">
                    {link.title}
                  </Heading>
                  {link.description && (
                    <Text colorScheme="gray">{link.description}</Text>
                  )}
                </Stack>
              </Card>
            </Link>
          ))}
        </Box>

        <MotionBox
          position="absolute"
          inset={-1}
          bgGradient="linear-gradient(to top, var(--chakra-colors-gray-800), rgba(39, 39, 42, 0))"
          zIndex="banner"
          pointerEvents="none"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: sectionHeight === "auto" ? 0 : 1,
          }}
        />
      </MotionBox>

      {sectionHeight !== "auto" && (
        <Flex alignItems="center" justifyContent="center">
          <LandingButton
            mb={8}
            onClick={() => setSectionHeight("auto")}
            rightIcon={<CaretDown />}
          >
            Read more about Guild
          </LandingButton>
        </Flex>
      )}
    </LandingWideSection>
  )
}

export default Discover
