import {
  Flex,
  Skeleton,
  Stack,
  Tag,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import ConnectWalletButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/ConnectWalletButton"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import {
  CapacityTag,
  EndTimeTag,
  StartTimeTag,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import useGuild from "components/[guild]/hooks/useGuild"
import CircleDivider from "components/common/CircleDivider"
import dynamic from "next/dynamic"
import { getRolePlatformTimeframeInfo } from "utils/rolePlatformHelpers"
import { Chains } from "wagmiConfig/chains"
import useNftDetails from "../../hooks/useNftDetails"
import CollectNftButton from "./components/CollectNftButton"
import NftFeesTable from "./components/NftFeesTable"

const availibiltyTagStyleProps = {
  bgColor: "transparent",
  fontSize: "sm",
  fontWeight: "medium",
  colorScheme: "purple",
  p: 0,
}

const AmountPicker = dynamic(() => import("./components/AmountPicker"))

const CollectNft = () => {
  const tableBgColor = useColorModeValue("gray.50", "blackAlpha.300")

  const { roles } = useGuild()
  const {
    chain,
    nftAddress,
    alreadyCollected,
    rolePlatformId,
    guildPlatform,
    isLegacy,
  } = useCollectNftContext()
  const rolePlatform = roles
    ?.flatMap((r) => r.rolePlatforms)
    .find((rp) => rp.id === rolePlatformId)
  const {
    totalSupply,
    totalCollectorsToday,
    maxSupply,
    mintableAmountPerUser,
    isLoading,
  } = useNftDetails(chain, nftAddress)

  const { isAvailable: isButtonEnabled, startTimeDiff } =
    getRolePlatformTimeframeInfo(rolePlatform)

  const padding = { base: 5, sm: 6, lg: 7, xl: 8 }

  return (
    <Stack p={padding} w="full" alignItems="center" spacing={4}>
      {/* Only show the amount picker if the user can mint unlimited or more than 1 NFTs */}
      {!isLegacy && mintableAmountPerUser !== BigInt(1) && <AmountPicker />}

      <Stack w="full" spacing={2}>
        <NftFeesTable bgColor={tableBgColor} mt="2" mb="1" />
        <ConnectWalletButton />
        <SwitchNetworkButton
          targetChainId={Chains[chain]}
          hidden={typeof alreadyCollected === "undefined" || alreadyCollected}
        />
        <Tooltip
          isDisabled={isButtonEnabled}
          label={
            startTimeDiff > 0 ? "Claim hasn't started yet" : "Claim already ended"
          }
          hasArrow
          shouldWrapChildren
        >
          <CollectNftButton
            isDisabled={!isButtonEnabled}
            label="Collect now"
            colorScheme="green"
          />
        </Tooltip>
      </Stack>

      <Skeleton
        maxW="max-content"
        isLoaded={
          !isLoading &&
          (typeof totalSupply !== "undefined" ||
            typeof totalCollectorsToday !== "undefined")
        }
      >
        {isLoading ? (
          "Loading collectors..."
        ) : (
          <Flex justifyContent="center" alignItems="center" wrap="wrap">
            {guildPlatform?.platformGuildData?.function ===
              ContractCallFunction.DEPRECATED_SIMPLE_CLAIM &&
              typeof rolePlatform?.capacity === "number" && (
                <>
                  <CapacityTag
                    capacity={rolePlatform.capacity}
                    claimedCount={rolePlatform.claimedCount}
                    {...availibiltyTagStyleProps}
                  />
                  <CircleDivider />
                </>
              )}

            {!!maxSupply && typeof totalSupply === "bigint" && (
              <>
                <CapacityTag
                  capacity={Number(maxSupply)}
                  claimedCount={Number(totalSupply)}
                  {...availibiltyTagStyleProps}
                />
                <CircleDivider />
              </>
            )}

            {rolePlatform?.startTime && startTimeDiff > 0 && (
              <>
                <StartTimeTag
                  startTime={rolePlatform?.startTime}
                  {...availibiltyTagStyleProps}
                />
                <CircleDivider />
              </>
            )}

            {rolePlatform?.endTime && (
              <>
                <EndTimeTag
                  endTime={rolePlatform?.endTime}
                  {...availibiltyTagStyleProps}
                />
                <CircleDivider />
              </>
            )}

            {typeof rolePlatform?.capacity !== "number" && (
              <>
                <Tag {...availibiltyTagStyleProps} colorScheme="gray">
                  {`${new Intl.NumberFormat("en", {
                    notation: "standard",
                  }).format(totalSupply ?? 0)} collected`}
                </Tag>
                {typeof totalCollectorsToday === "bigint" && <CircleDivider />}
              </>
            )}

            {typeof totalCollectorsToday === "bigint" && (
              <Tag {...availibiltyTagStyleProps} colorScheme="gray">
                {`${new Intl.NumberFormat("en", {
                  notation: "standard",
                }).format(totalCollectorsToday)} collected today`}
              </Tag>
            )}
          </Flex>
        )}
      </Skeleton>
    </Stack>
  )
}

export default CollectNft
