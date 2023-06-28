import {
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import CollectibleImage from "components/[guild]/collect/components/CollectibleImage"
import Details from "components/[guild]/collect/components/Details"
import Links from "components/[guild]/collect/components/Links"
import NftByRole from "components/[guild]/collect/components/NftByRole"
import RequirementsCard from "components/[guild]/collect/components/RequirementsCard"
import RichTextDescription from "components/[guild]/collect/components/RichTextDescription"
import ShareButton from "components/[guild]/collect/components/ShareButton"
import TopCollectors from "components/[guild]/collect/components/TopCollectors"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import { CollectNftProvider } from "components/[guild]/Requirements/components/GuildCheckout/components/CollectNftContext"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import { Chain } from "connectors"
import { AnimatePresence, motion } from "framer-motion"
import useScrollEffect from "hooks/useScrollEffect"
import { GetStaticPaths, GetStaticProps } from "next"
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
  const { theme, imageUrl, name, urlName, roles, guildPlatforms } = useGuild()
  const { textColor } = useThemeContext()
  const guildPlatform = guildPlatforms.find(
    (gp) =>
      gp.platformGuildData?.chain === chain &&
      gp.platformGuildData?.contractAddress?.toLowerCase() === address
  )
  const role = roles?.find((r) =>
    r.rolePlatforms?.find((rp) => rp.guildPlatformId === guildPlatform.id)
  )
  const rolePlatformId = role?.rolePlatforms?.find(
    (rp) => rp.guildPlatformId === guildPlatform.id
  )?.id
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
    <CollectNftProvider
      roleId={role.id}
      rolePlatformId={rolePlatformId}
      chain={chain}
      address={address}
    >
      <Layout
        ogTitle="Collect NFT"
        background={theme?.color ?? "gray.900"}
        backgroundImage={theme?.backgroundImage}
        maxWidth="container.xl"
      >
        <Stack spacing={4}>
          <HStack justifyContent="space-between">
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

            <ShareButton />
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
                    {data?.name}
                  </Heading>

                  <NftByRole role={role} />

                  {isMobile && (
                    <RequirementsCard
                      requirements={requirements}
                      logic={role?.logic}
                    />
                  )}

                  <Box ref={nftDescriptionRef} lineHeight={1.75}>
                    <RichTextDescription
                      text={guildPlatform.platformGuildData?.description}
                    />
                  </Box>
                </Stack>

                <Links />
                <Details />

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
                        <CollectibleImage
                          src={data?.image}
                          isLoading={isValidating}
                        />

                        <Stack spacing={4}>
                          <Heading as="h2" fontFamily="display" fontSize="2xl">
                            {data?.name}
                          </Heading>

                          <NftByRole role={role} />
                        </Stack>
                      </SimpleGrid>
                    </CardMotionWrapper>
                  )}

                  <motion.div layout="position">
                    <RequirementsCard
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
    </CollectNftProvider>
  )
}

const CollectNftPage = ({ fallback, ...rest }: Props) => (
  <SWRConfig value={fallback && { fallback }}>
    <LinkPreviewHead path={Object.values(fallback ?? {})[0]?.urlName ?? ""} />
    <ThemeProvider>
      <Page {...rest} />
    </ThemeProvider>
  </SWRConfig>
)

const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { chain: chainFromQuery, address: addressFromQuery, guild: urlName } = params
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

const getStaticPaths: GetStaticPaths = () => ({
  /**
   * We don't know the paths in advance, but since we're using fallback: blocking,
   * the pages will be generated on-the-fly, and from that point we'll serve them
   * from cache
   */
  paths: [],
  fallback: "blocking",
})

export default CollectNftPage
export { getStaticProps, getStaticPaths }
