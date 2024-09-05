import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import {
  Box,
  Divider,
  HStack,
  Heading,
  SimpleGrid,
  Spacer,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { ContractCallSupportedChain } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import { ThemeProvider } from "components/[guild]/ThemeContext"
import CollectNft from "components/[guild]/collect/components/CollectNft"
import { CollectNftProvider } from "components/[guild]/collect/components/CollectNftContext"
import CollectibleImage from "components/[guild]/collect/components/CollectibleImage"
import Details from "components/[guild]/collect/components/Details"
import GuildImageAndName from "components/[guild]/collect/components/GuildImageAndName"
import Links from "components/[guild]/collect/components/Links"
import RequirementsCard from "components/[guild]/collect/components/RequirementsCard"
import RichTextDescription from "components/[guild]/collect/components/RichTextDescription"
import ShareAndReportButtons from "components/[guild]/collect/components/ShareAndReportButtons"
import SmallImageAndRoleName from "components/[guild]/collect/components/SmallImageAndRoleName"
import TiltCard from "components/[guild]/collect/components/TiltCard"
import TopCollectors from "components/[guild]/collect/components/TopCollectors"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useShouldShowSmallImage from "components/[guild]/collect/hooks/useShouldShowSmallImage"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import Layout from "components/common/Layout"
import LinkPreviewHead from "components/common/LinkPreviewHead"
import { env } from "env"
import { AnimatePresence } from "framer-motion"
import { GetStaticPaths } from "next"
import dynamic from "next/dynamic"
import {
  validateNftAddress,
  validateNftChain,
} from "pages/api/nft/collectors/[chain]/[address]"
import { useRef } from "react"
import { SWRConfig, unstable_serialize } from "swr"
import { Guild, PlatformType } from "types"
import fetcher from "utils/fetcher"
import { Chain } from "wagmiConfig/chains"

type Props = {
  chain: Chain
  address: `0x${string}`
  urlName: string
  guildPlatformId: number
  roleId: number
  rolePlatformId: number
  fallbackImage?: string
  fallback: { [x: string]: Guild }
}

const DynamicEditNFTButton = dynamic(
  () => import("components/[guild]/collect/components/EditNftButton"),
  { ssr: false }
)

const DynamicEditNFTDescriptionModalButton = dynamic(
  () =>
    import("components/[guild]/collect/components/EditNFTDescriptionModalButton"),
  { ssr: false }
)

export const topCollectorsSupportedChains = [
  "POLYGON",
  "BASE_MAINNET",
  "ETHEREUM",
  "OPTIMISM",
  "ARBITRUM",
  "SEPOLIA",
] as const satisfies ContractCallSupportedChain[]

const CollectNftPageContent = ({
  chain,
  address,
  guildPlatformId,
  roleId,
  fallbackImage,
}: Omit<Props, "urlName" | "fallback">) => {
  const { theme, roles } = useGuild()
  const { isAdmin } = useGuildPermission()

  const { guildPlatform } = useGuildPlatform(guildPlatformId)
  const role = roles.find((r) => r.id === roleId)

  const isMobile = useBreakpointValue({ base: true, md: false })
  const nftDescriptionRef = useRef<HTMLDivElement>(null)
  const shouldShowSmallImage = useShouldShowSmallImage(nftDescriptionRef)

  const {
    name,
    image: imageFromHook,
    totalSupply,
    creator,
  } = useNftDetails(chain, address)
  const image = imageFromHook || fallbackImage

  const { address: userAddress } = useWeb3ConnectionManager()
  const isNFTCreator =
    isAdmin && creator?.toLowerCase() === userAddress?.toLowerCase()

  return (
    <Layout
      ogTitle="Collect NFT"
      background={theme?.color ?? "gray.900"}
      backgroundImage={theme?.backgroundImage}
      maxWidth="container.xl"
    >
      <Stack spacing={4}>
        <HStack justifyContent="space-between">
          <GuildImageAndName />
          <HStack>
            <ShareAndReportButtons
              isPulseMarkerHidden={totalSupply > 0}
              shareButtonLocalStorageKey={`${chain}_${address}_hasClickedShareButton`}
              shareText={`Check out and collect this awesome ${
                name ? `${name} ` : " "
              }NFT on Guild!`}
            />

            {isNFTCreator && <DynamicEditNFTButton />}
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
            <CollectibleImage
              src={image}
              isLoading={!image}
              imageWrapper={TiltCard}
            />

            <Stack spacing={6}>
              <Heading
                as="h2"
                fontFamily="display"
                fontSize={{ base: "3xl", lg: "4xl" }}
              >
                {name}
              </Heading>

              {isMobile && (
                <RequirementsCard role={role}>
                  <CollectNft />
                </RequirementsCard>
              )}

              <Box ref={nftDescriptionRef} lineHeight={1.75}>
                <HStack alignItems="start" justifyContent="flex-end">
                  <RichTextDescription
                    text={guildPlatform?.platformGuildData?.description}
                  />
                  <Spacer m="0" />
                  {isAdmin && (
                    <DynamicEditNFTDescriptionModalButton
                      guildPlatform={guildPlatform}
                    />
                  )}
                </HStack>
              </Box>
            </Stack>
            <Divider />
            <Links />
            <Divider />
            <Details />
            {!!topCollectorsSupportedChains.includes(
              chain as (typeof topCollectorsSupportedChains)[number]
            ) && (
              <>
                <Divider />
                <TopCollectors />
              </>
            )}
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
                  <SmallImageAndRoleName
                    imageElement={
                      <CollectibleImage src={image} isLoading={!image} />
                    }
                    name={name}
                    role={role}
                  />
                )}

                <RequirementsCard role={role}>
                  <CollectNft />
                </RequirementsCard>
              </Stack>
            </AnimatePresence>
          )}
        </SimpleGrid>
      </Stack>
    </Layout>
  )
}

const CollectNftPageProviderWrapper = (
  props: Omit<Props, "urlName" | "fallback">
) => {
  const { chain, address, guildPlatformId, rolePlatformId, roleId } = props
  const { guildPlatforms } = useGuild()

  return (
    <CollectNftProvider
      guildPlatform={guildPlatforms?.find((gp) => gp.id === guildPlatformId)}
      roleId={roleId}
      rolePlatformId={rolePlatformId}
      chain={chain}
      nftAddress={address}
    >
      <CollectNftPageContent {...props} />
    </CollectNftProvider>
  )
}

const CollectNftPage = ({ fallback, urlName, ...rest }: Props) => (
  <SWRConfig value={fallback && { fallback }}>
    <LinkPreviewHead path={urlName} />
    <ThemeProvider>
      <CollectNftPageProviderWrapper {...rest} />
    </ThemeProvider>
  </SWRConfig>
)
const getStaticProps = async ({ params }) => {
  const { chain: chainFromQuery, address: addressFromQuery, guild: urlName } = params
  const chain = validateNftChain(chainFromQuery)
  const address = validateNftAddress(addressFromQuery)

  if (!chain || !address)
    return {
      notFound: true,
      revalidate: 300,
    }

  const guildPageEndpoint = `/v2/guilds/guild-page/${urlName}`

  let publicGuild: Guild, guild: Guild
  try {
    ;[publicGuild, guild] = await Promise.all([
      fetcher(guildPageEndpoint),
      fetcher(`${env.NEXT_PUBLIC_API.replace("/v1", "")}${guildPageEndpoint}`, {
        headers: {
          "x-guild-service": "APP",
          "x-guild-auth": env.GUILD_API_KEY,
        },
      }),
    ])
  } catch {
    return {
      notFound: true,
      revalidate: 300,
    }
  }

  const nftGuildReward = guild.guildPlatforms.find(
    (gp) =>
      gp.platformId === PlatformType.CONTRACT_CALL &&
      gp.platformGuildData.chain === chain &&
      gp.platformGuildData.contractAddress.toLowerCase() === address
  )

  const nftRoleReward = guild.roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === nftGuildReward?.id)

  const nftRole = guild.roles.find((role) => role.id === nftRoleReward?.roleId)

  if (!nftGuildReward || !nftRoleReward || !nftRole)
    return {
      notFound: true,
      revalidate: 300,
    }

  // Calling the serverless endpoint, so if we fetch this data for the first time, it'll be added to the Vercel cache

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"
  const nftDetails = await fetch(`${baseUrl}/api/nft/${chain}/${address}`)
    .then((res) => res.json())
    .catch(() => undefined)

  const isPublicNFT = !!publicGuild.guildPlatforms.find(
    (gp) => gp.id === nftGuildReward.id
  )

  return {
    revalidate: 600, // Revalidate at most once every 10 minutes
    props: {
      urlName: publicGuild.urlName,
      chain,
      address,
      guildPlatformId: nftGuildReward.id,
      rolePlatformId: nftRoleReward.id,
      roleId: nftRole.id,
      fallbackImage: nftGuildReward.platformGuildData.imageUrl,
      // Pre-populating the public guild & requirements caches
      fallback: {
        [guildPageEndpoint]: {
          ...publicGuild,
          // An NFT is always public (it can be found on the blockchain), so we can add the guildPlatform to the public guild cache
          guildPlatforms: isPublicNFT
            ? publicGuild.guildPlatforms
            : [...publicGuild.guildPlatforms, nftGuildReward],
        },
        [`/v2/guilds/${publicGuild.id}/roles/${nftRole.id}/requirements`]:
          publicGuild.roles.find((r) => r.id === nftRole.id)?.requirements ?? [],
        ...(!!nftDetails
          ? {
              [unstable_serialize(["nftDetails", chain, address])]: nftDetails,
            }
          : {}),
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
