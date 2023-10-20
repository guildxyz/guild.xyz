import {
  Box,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Chain } from "chains"
import CollectibleImage from "components/[guild]/collect/components/CollectibleImage"
import { CollectNftProvider } from "components/[guild]/collect/components/CollectNftContext"
import Details from "components/[guild]/collect/components/Details"
import Links from "components/[guild]/collect/components/Links"
import NftByRole from "components/[guild]/collect/components/NftByRole"
import RequirementsCard from "components/[guild]/collect/components/RequirementsCard"
import RichTextDescription from "components/[guild]/collect/components/RichTextDescription"
import ShareButton from "components/[guild]/collect/components/ShareButton"
import TopCollectors from "components/[guild]/collect/components/TopCollectors"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import ReportGuildButton from "components/[guild]/ReportGuildButton"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import PulseMarker from "components/common/PulseMarker"
import { AnimatePresence, motion } from "framer-motion"
import useLocalStorage from "hooks/useLocalStorage"
import useScrollEffect from "hooks/useScrollEffect"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import ErrorPage from "pages/_error"
import {
  validateNftAddress,
  validateNftChain,
} from "pages/api/nft/collectors/[chain]/[address]"
import { useRef, useState } from "react"
import { SWRConfig } from "swr"
import { Guild, Requirement } from "types"
import fetcher from "utils/fetcher"

type Props = {
  chain: Chain
  address: `0x${string}`
  fallback: { [x: string]: Guild }
}
const Page = ({
  chain: chainFromProps,
  address: addressFromProps,
}: Omit<Props, "fallback">) => {
  const router = useRouter()
  const { chain: chainFromQuery, address: addressFromQuery } = router.query

  const chain = chainFromProps ?? validateNftChain(chainFromQuery)
  const address = addressFromProps ?? validateNftAddress(addressFromQuery)

  const {
    theme,
    imageUrl,
    name: guildName,
    urlName,
    roles,
    guildPlatforms,
    isFallback,
  } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { textColor, buttonColorScheme } = useThemeContext()

  const guildPlatform = guildPlatforms?.find(
    (gp) =>
      gp.platformGuildData?.chain === chain &&
      gp.platformGuildData?.contractAddress?.toLowerCase() === address
  )

  const role = roles?.find((r) =>
    r.rolePlatforms?.find((rp) => rp.guildPlatformId === guildPlatform?.id)
  )
  const rolePlatformId = role?.rolePlatforms?.find(
    (rp) => rp.guildPlatformId === guildPlatform?.id
  )?.id
  const requirements = !!role
    ? role.hiddenRequirements || (role.requirements.length === 0 && !isFallback)
      ? [...role.requirements, { type: "HIDDEN", roleId: role.id } as Requirement]
      : role.requirements
    : []

  const isMobile = useBreakpointValue({ base: true, md: false })

  const nftDescriptionRef = useRef<HTMLDivElement>(null)
  const [shouldShowSmallImage, setShouldShowSmallImage] = useState(false)
  useScrollEffect(() => {
    const nftDescription = nftDescriptionRef.current
    setShouldShowSmallImage(nftDescription.getBoundingClientRect().top < 100)
  }, [])

  const { name, image, totalCollectors, isLoading } = useNftDetails(chain, address)

  const [hasClickedShareButton, setHasClickedShareButton] = useLocalStorage(
    `${chain}_${address}_hasClickedShareButton`,
    false
  )

  if (!isFallback && !guildPlatform) return <ErrorPage statusCode={404} />

  return (
    <CollectNftProvider
      roleId={role?.id}
      rolePlatformId={rolePlatformId}
      guildPlatform={guildPlatform}
      chain={chain}
      nftAddress={address}
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
                {guildName}
              </Link>
            </HStack>

            <HStack>
              <PulseMarker
                placement="top"
                hidden={!isAdmin || hasClickedShareButton || totalCollectors > 0}
              >
                <ShareButton onClick={() => setHasClickedShareButton(true)} />
              </PulseMarker>
              {!isAdmin && (
                <ReportGuildButton
                  layout="ICON"
                  colorScheme={buttonColorScheme}
                  color={textColor}
                />
              )}
            </HStack>
          </HStack>

          <SimpleGrid
            templateColumns={{
              base: "1fr",
              md: "7fr 5fr",
            }}
            gap={{ base: 6, lg: 8 }}
          >
            <Stack overflow="hidden" w="full" spacing={{ base: 6, lg: 8 }}>
              <CollectibleImage src={image} isLoading={isLoading} />

              <Stack spacing={6}>
                <Heading
                  as="h2"
                  fontFamily="display"
                  fontSize={{ base: "3xl", lg: "4xl" }}
                >
                  {name}
                </Heading>
                {isMobile && (
                  <RequirementsCard
                    requirements={requirements}
                    logic={role?.logic}
                    anyOfNum={role?.anyOfNum}
                  />
                )}

                <Box ref={nftDescriptionRef} lineHeight={1.75}>
                  <RichTextDescription
                    text={guildPlatform?.platformGuildData?.description}
                  />
                </Box>
              </Stack>
              <Divider />
              <Links />
              <Divider />
              <Details />
              <Divider />
              <TopCollectors />
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
                        <CollectibleImage src={image} isLoading={isLoading} />

                        <Stack spacing={3} justifyContent={"center"}>
                          <Heading as="h2" fontFamily="display" fontSize="2xl">
                            {name}
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
                      anyOfNum={role?.anyOfNum}
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

  const endpoint = `/v2/guilds/guild-page/${urlName}`
  const guild: Guild = await fetcher(endpoint).catch((_) => ({}))

  if (!guild?.id)
    return {
      notFound: true,
    }

  guild.isFallback = true

  return {
    props: {
      chain,
      address,
      fallback: {
        [endpoint]: guild,
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
export { getStaticPaths, getStaticProps }
