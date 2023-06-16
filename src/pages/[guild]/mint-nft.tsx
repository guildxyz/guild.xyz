import {
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import useGuild from "components/[guild]/hooks/useGuild"
import NftByRole from "components/[guild]/mint-nft/components/NftByRole"
import NftDetails from "components/[guild]/mint-nft/components/NftDetails"
import NftImage from "components/[guild]/mint-nft/components/NftImage"
import RequirementsCard from "components/[guild]/mint-nft/components/RequirementsCard"
import TopMinters from "components/[guild]/mint-nft/components/TopMinters"
import { motion } from "framer-motion"
import useScrollEffect from "hooks/useScrollEffect"
import { useRef, useState } from "react"

const IMAGE_SRC =
  "https://guild-xyz.mypinata.cloud/ipfs/QmRMiu8iiVNi6FCZS3QnHamzp6QVpXJp3a2JDFv98LPxME"

const MotionHeading = motion(Heading)

const Page = () => {
  // TEMP, for testing
  const { theme, imageUrl, name, roles } = useGuild()
  const role = roles?.find((r) => r.id === 56990) ?? roles?.[0] // 56990 is a role in Johnny's Guild
  const requirements = role?.requirements ?? []

  const isMobile = useBreakpointValue({ base: true, md: false })

  const nftDescriptionRef = useRef<HTMLDivElement>(null)
  const [shouldShowSmallNftImage, setShouldShowSmallNftImage] = useState(false)
  useScrollEffect(() => {
    const nftDescription = nftDescriptionRef.current
    setShouldShowSmallNftImage(nftDescription.getBoundingClientRect().top < 40)
  }, [])

  return (
    <Layout
      ogTitle="Mint NFT"
      background={theme?.color ?? "gray.900"}
      backgroundImage={theme?.backgroundImage}
      maxWidth="container.xl"
    >
      <Stack spacing={8}>
        <HStack>
          <GuildLogo imageUrl={imageUrl} size={8} />
          <Text as="span" fontFamily="display" fontWeight="bold">
            {name}
          </Text>
        </HStack>

        <SimpleGrid
          templateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            xl: "7fr 5fr",
          }}
          gap={{ base: 6, lg: 8 }}
        >
          <Stack w="full" spacing={12}>
            <NftImage src={IMAGE_SRC} />

            <Stack spacing={8}>
              <Stack spacing={4}>
                <MotionHeading
                  layout="position"
                  layoutId="nft-name"
                  as="h2"
                  fontFamily="display"
                  fontSize="4xl"
                >
                  {`Joined ${name}`}
                </MotionHeading>

                <NftByRole role={role} />

                {isMobile && (
                  <RequirementsCard
                    requirements={requirements}
                    logic={role?.logic}
                  />
                )}

                <Text
                  ref={nftDescriptionRef}
                  lineHeight={1.75}
                >{`This is an on-chain proof that you joined ${name} on Guild.xyz.`}</Text>
                <Text lineHeight={1.75}>
                  Contrary to popular belief, Lorem Ipsum is not simply random text.
                  It has roots in a piece of classical Latin literature from 45 BC,
                  making it over 2000 years old. Richard McClintock, a Latin
                  professor at Hampden-Sydney College in Virginia, looked up one of
                  the more obscure Latin words, consectetur, from a Lorem Ipsum
                  passage, and going through the cites of the word in classical
                  literature, discovered the undoubtable source.
                </Text>
                <Text lineHeight={1.75}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                  a tincidunt nisi, eu cursus neque. Suspendisse bibendum sapien at
                  eleifend viverra. Vestibulum porttitor eget nunc eget gravida. In
                  hac habitasse platea dictumst. Etiam ut luctus urna, in rutrum
                  libero. Vestibulum et diam elementum, blandit ipsum quis, consequat
                  lacus. Mauris sed varius metus. In viverra risus turpis, a placerat
                  justo vehicula dictum. Vestibulum eu mollis justo, at semper orci.
                  Cras dapibus, tortor non ultricies commodo, nibh massa semper
                  lorem, ac facilisis eros dui et lacus.
                </Text>
              </Stack>

              <NftDetails
                chain="POLYGON"
                address="0xff04820c36759c9f5203021fe051239ad2dcca8a"
              />

              <TopMinters />
            </Stack>
          </Stack>

          {!isMobile && (
            <Stack
              position="sticky"
              top={{ base: 4, md: 5 }}
              spacing={8}
              h="max-content"
            >
              {shouldShowSmallNftImage && (
                <SimpleGrid
                  gridTemplateColumns="var(--chakra-sizes-24) auto"
                  gap={4}
                >
                  <NftImage src={IMAGE_SRC} />

                  <Stack spacing={4}>
                    <MotionHeading
                      layout="position"
                      layoutId="nft-name"
                      as="h2"
                      fontFamily="display"
                      fontSize="2xl"
                    >
                      {`Joined ${name}`}
                    </MotionHeading>

                    <NftByRole role={role} />
                  </Stack>
                </SimpleGrid>
              )}

              <motion.div layout="position">
                <RequirementsCard requirements={requirements} logic={role?.logic} />
              </motion.div>
            </Stack>
          )}
        </SimpleGrid>
      </Stack>
    </Layout>
  )
}

export default Page
