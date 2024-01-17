import {
  Circle,
  Flex,
  Skeleton,
  Stack,
  Tag,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Chains } from "chains"
import RoleRequirements from "components/[guild]/Requirements"
import { RoleRequirementsSkeleton } from "components/[guild]/Requirements/RoleRequirements"
import ConnectWalletButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/ConnectWalletButton"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import { RoleRequirementsSectionHeader } from "components/[guild]/RoleCard/components/RoleRequirementsSection"
import {
  CapacityTag,
  EndTimeTag,
  StartTimeTag,
  getTimeDiff,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import CollectNftButton from "components/[guild]/collect/components/CollectNftButton"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import useGuild from "components/[guild]/hooks/useGuild"
import Card from "components/common/Card"
import { Role } from "types"
import useNftDetails from "../hooks/useNftDetails"
import CollectNftFeesTable from "./CollectNftFeesTable"

type Props = {
  role: Role
}

const RequirementsCard = ({ role }: Props) => {
  const requirementsSectionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const requirementsSectionBorderColor = useColorModeValue("gray.200", "gray.600")

  const { isOpen: isExpanded, onToggle: onToggleExpanded } = useDisclosure()

  const availibiltyTagStyleProps = {
    bgColor: "transparent",
    fontSize: "sm",
    fontWeight: "medium",
    colorScheme: "purple",
    p: 0,
  }

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

  const startTimeDiff = getTimeDiff(rolePlatform?.startTime)
  const endTimeDiff = getTimeDiff(rolePlatform?.endTime)
  const isButtonDisabled =
    startTimeDiff > 0 ||
    endTimeDiff < 0 ||
    (typeof rolePlatform?.capacity === "number" &&
      rolePlatform?.capacity === rolePlatform?.claimedCount)

  const padding = { base: 5, sm: 6, lg: 7, xl: 8 }

  return (
    <Card w="full" h="max-content">
      <Stack
        position="relative"
        bgColor={requirementsSectionBgColor}
        w="full"
        alignItems="center"
        borderBottomWidth={1}
        borderColor={requirementsSectionBorderColor}
      >
        <RoleRequirementsSectionHeader />
        {!role ? (
          <RoleRequirementsSkeleton />
        ) : (
          <RoleRequirements
            {...{
              role,
              isExpanded,
              onToggleExpanded,
              isOpen: true,
            }}
          />
        )}
      </Stack>

      <Stack p={padding} w="full" alignItems="center" spacing={4}>
        <CollectNftFeesTable bgColor={requirementsSectionBgColor} />

        <Stack w="full" spacing={2}>
          <ConnectWalletButton />
          <SwitchNetworkButton
            targetChainId={Chains[chain]}
            hidden={typeof alreadyCollected === "undefined" || alreadyCollected}
          />
          <Tooltip
            isDisabled={!isButtonDisabled}
            label={
              startTimeDiff > 0 ? "Claim hasn't started yet" : "Claim already ended"
            }
            hasArrow
            shouldWrapChildren
          >
            <CollectNftButton
              isDisabled={isButtonDisabled}
              label="Collect now"
              colorScheme="green"
            />
          </Tooltip>
        </Stack>

        <Skeleton
          maxW="max-content"
          isLoaded={
            !isLoading &&
            typeof totalCollectors !== "undefined" &&
            typeof totalCollectorsToday !== "undefined"
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
                  <CircleDivider />
                </>
              )}

              <Tag {...availibiltyTagStyleProps} colorScheme="gray">
                {`${
                  new Intl.NumberFormat("en", {
                    notation: "standard",
                  }).format(totalCollectorsToday) ?? 0
                } collected today`}
              </Tag>
            </Flex>
          )}
        </Skeleton>
      </Stack>
    </Card>
  )
}

const CircleDivider = () => <Circle size={1} mx={1.5} bgColor="gray.400" />

export default RequirementsCard
