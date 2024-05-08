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
import {
  CapacityTag,
  EndTimeTag,
  StartTimeTag,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import CollectNftButton from "components/[guild]/collect/components/CollectNftButton"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import useGuild from "components/[guild]/hooks/useGuild"
import CircleDivider from "components/common/CircleDivider"
import { getRolePlatformTimeframeInfo } from "utils/rolePlatformHelpers"
import { Chains } from "wagmiConfig/chains"
import useNftDetails from "../hooks/useNftDetails"
import CollectNftFeesTable from "./CollectNftFeesTable"

const availibiltyTagStyleProps = {
  bgColor: "transparent",
  fontSize: "sm",
  fontWeight: "medium",
  colorScheme: "purple",
  p: 0,
}

const CollectNft = () => {
  const tableBgColor = useColorModeValue("gray.50", "blackAlpha.300")

  const { roles } = useGuild()
  const { chain, nftAddress, alreadyCollected, rolePlatformId } =
    useCollectNftContext()
  const rolePlatform = roles
    ?.flatMap((r) => r.rolePlatforms)
    .find((rp) => rp.id === rolePlatformId)
  const { totalCollectors, totalCollectorsToday, isLoading } = useNftDetails(
    chain,
    nftAddress
  )

  const { isAvailable: isButtonEnabled, startTimeDiff } =
    getRolePlatformTimeframeInfo(rolePlatform)

  const padding = { base: 5, sm: 6, lg: 7, xl: 8 }

  return (
    <Stack p={padding} w="full" alignItems="center" spacing={4}>
      <CollectNftFeesTable bgColor={tableBgColor} />

      <Stack w="full" spacing={2}>
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
          (typeof totalCollectors !== "undefined" ||
            typeof totalCollectorsToday !== "undefined")
        }
      >
        {isLoading ? (
          "Loading collectors..."
        ) : (
          <Flex justifyContent="center" alignItems="center" wrap="wrap">
            {typeof rolePlatform?.capacity === "number" && (
              <>
                <CapacityTag
                  capacity={rolePlatform.capacity}
                  claimedCount={rolePlatform.claimedCount}
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
                  {`${
                    new Intl.NumberFormat("en", {
                      notation: "standard",
                    }).format(totalCollectors) ?? 0
                  } collected`}
                </Tag>
                {typeof totalCollectorsToday === "number" && <CircleDivider />}
              </>
            )}

            {typeof totalCollectorsToday === "number" && (
              <Tag {...availibiltyTagStyleProps} colorScheme="gray">
                {`${
                  new Intl.NumberFormat("en", {
                    notation: "standard",
                  }).format(totalCollectorsToday) ?? 0
                } collected today`}
              </Tag>
            )}
          </Flex>
        )}
      </Skeleton>
    </Stack>
  )
}

export default CollectNft
