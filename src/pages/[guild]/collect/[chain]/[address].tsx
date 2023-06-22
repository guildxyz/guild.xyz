import {
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import CollectibleImage from "components/[guild]/collect/components/CollectibleImage"
import Details from "components/[guild]/collect/components/Details"
import Links from "components/[guild]/collect/components/Links"
import NftByRole from "components/[guild]/collect/components/NftByRole"
import RequirementsCard from "components/[guild]/collect/components/RequirementsCard"
import TopCollectors from "components/[guild]/collect/components/TopCollectors"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import { Chain } from "connectors"
import { AnimatePresence, motion } from "framer-motion"
import useScrollEffect from "hooks/useScrollEffect"
import { GetServerSideProps } from "next"
import {
  validateNftAddress,
  validateNftChain,
} from "pages/api/nft/collectors/[chain]/[address]"
import { useRef, useState } from "react"
import { SWRConfig, unstable_serialize } from "swr"
import { Guild } from "types"
import fetcher from "utils/fetcher"

type Props = {
  chain: Chain
  address: string
  fallback: { [x: string]: Guild }
}
const Page = ({ chain, address }: Omit<Props, "fallback">) => {
  const { theme, imageUrl, name, urlName, roles } = useGuild()
  const { textColor } = useThemeContext()
  const role = roles?.find((r) => r.id === 56990) ?? roles?.[0] // TODO: 56990 is a role in Johnny's Guild, we should change this to a dynamic value
  const requirements = role?.requirements ?? []

  const isMobile = useBreakpointValue({ base: true, md: false })

  const nftDescriptionRef = useRef<HTMLDivElement>(null)
  const [shouldShowSmallImage, setShouldShowSmallImage] = useState(false)
  useScrollEffect(() => {
    const nftDescription = nftDescriptionRef.current
    setShouldShowSmallImage(nftDescription.getBoundingClientRect().top < 100)
  }, [])

  const { data, isValidating } = useNftDetails(chain, address)

  return (
    <Layout
      ogTitle="Collect NFT"
      background={theme?.color ?? "gray.900"}
      backgroundImage={theme?.backgroundImage}
      maxWidth="container.xl"
    >
      <Stack spacing={8}>
        <HStack>
          <GuildLogo imageUrl={imageUrl} size={8} />
          <Link
            href={`/${urlName}`}
            fontFamily="display"
            fontWeight="bold"
            color={textColor}
          >
            {name}
          </Link>
        </HStack>

        <SimpleGrid
          templateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            xl: "7fr 5fr",
          }}
          gap={{ base: 6, lg: 8 }}
        >
          <Stack overflow="hidden" w="full" spacing={12}>
            <CollectibleImage src={data?.image} isLoading={isValidating} />

            <Stack spacing={8}>
              <Stack spacing={4}>
                <Heading as="h2" fontFamily="display" fontSize="4xl">
                  {`Joined ${name}`}
                </Heading>

                <NftByRole role={role} />

                {isMobile && (
                  <RequirementsCard
                    chain={chain}
                    address={address}
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

              <Links chain={chain} address={address} />
              <Details chain={chain} address={address} />

              <TopCollectors />
            </Stack>
          </Stack>

          {!isMobile && (
            <AnimatePresence>
              <Stack
                position="sticky"
                top={{ base: 4, md: 5 }}
                spacing={8}
                h="max-content"
              >
                {shouldShowSmallImage && (
                  <CardMotionWrapper animateOnMount>
                    <SimpleGrid
                      gridTemplateColumns="var(--chakra-sizes-24) auto"
                      gap={4}
                    >
                      <CollectibleImage src={data?.image} isLoading={isValidating} />

                      <Stack spacing={4}>
                        <Heading as="h2" fontFamily="display" fontSize="2xl">
                          {`Joined ${name}`}
                        </Heading>

                        <NftByRole role={role} />
                      </Stack>
                    </SimpleGrid>
                  </CardMotionWrapper>
                )}

                <motion.div layout="position">
                  <RequirementsCard
                    chain={chain}
                    address={address}
                    requirements={requirements}
                    logic={role?.logic}
                  />
                </motion.div>
              </Stack>
            </AnimatePresence>
          )}
        </SimpleGrid>
      </Stack>
    </Layout>
  )
}

const CollectNftPage = ({ fallback, ...rest }: Props) => (
  <SWRConfig value={fallback && { fallback }}>
    <ThemeProvider>
      <Page {...rest} />
    </ThemeProvider>
  </SWRConfig>
)

// TODO: we'll probably be able to switch to ISR at some point
const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { chain: chainFromQuery, address: addressFromQuery, guild: urlName } = query
  const chain = validateNftChain(chainFromQuery)
  const address = validateNftAddress(addressFromQuery)

  if (!chain || !address)
    return {
      notFound: true,
    }

  // TODO: call the v2 endpoint
  const endpoint = `/guild/${urlName}`
  const guild = await fetcher(endpoint).catch((_) => ({}))

  if (!guild?.id)
    return {
      notFound: true,
    }

  return {
    props: {
      chain,
      address,
      fallback: {
        [endpoint]: guild,
        [unstable_serialize([endpoint, { method: "GET", body: {} }])]: guild,
      },
    },
  }
}

export default CollectNftPage
export { getServerSideProps }
