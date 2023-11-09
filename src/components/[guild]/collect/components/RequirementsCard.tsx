import {
  Box,
  Circle,
  Flex,
  Skeleton,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { Chains } from "chains"
import LogicDivider from "components/[guild]/LogicDivider"
import AnyOfHeader from "components/[guild]/Requirements/components/AnyOfHeader"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import {
  CapacityTag,
  EndTimeTag,
  StartTimeTag,
  getTimeDiff,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/CapacityTimeTags"
import CollectNftButton from "components/[guild]/collect/components/CollectNftButton"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import useGuild from "components/[guild]/hooks/useGuild"
import Card from "components/common/Card"
import { Logic, Requirement } from "types"
import useNftDetails from "../hooks/useNftDetails"
import CollectNftFeesTable from "./CollectNftFeesTable"

type Props = {
  requirements: Requirement[]
  logic: Logic
  anyOfNum?: number
}

const RequirementsCard = ({ requirements, logic, anyOfNum }: Props) => {
  const requirementsSectionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const requirementsSectionBorderColor = useColorModeValue("gray.200", "gray.600")
  const capacityTimeTagStyleProps = {
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
    ?.flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.id === rolePlatformId)
  const { totalCollectors, totalCollectorsToday, isLoading } = useNftDetails(
    chain,
    nftAddress
  )

  const startTimeDiff = getTimeDiff(rolePlatform?.startTime)
  const endTimeDiff = getTimeDiff(rolePlatform?.endTime)

  const padding = { base: 5, sm: 6, lg: 7, xl: 8 }

  return (
    <Card w="full" h="max-content">
      <Stack
        bgColor={requirementsSectionBgColor}
        w="full"
        alignItems="center"
        borderBottomWidth={1}
        borderColor={requirementsSectionBorderColor}
      >
        <Text
          as="span"
          pt={padding}
          px={padding}
          pb={2}
          w="full"
          fontSize="xs"
          fontWeight="bold"
          color="gray"
          textTransform="uppercase"
          noOfLines={1}
        >
          Requirements to qualify
        </Text>

        <Stack spacing={0} w="full">
          {logic === "ANY_OF" && <AnyOfHeader anyOfNum={anyOfNum} />}
          <Stack spacing={0} w="full" px={padding} pb={padding}>
            {requirements.map((requirement, i) => (
              <Box key={requirement.id}>
                <RequirementDisplayComponent requirement={requirement} />
                {i < requirements.length - 1 && <LogicDivider logic={logic} />}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Stack>

      <Stack p={padding} w="full" alignItems="center" spacing={4}>
        <CollectNftFeesTable bgColor={requirementsSectionBgColor} />

        <Stack w="full" spacing={2}>
          {typeof alreadyCollected !== "undefined" && !alreadyCollected && (
            <SwitchNetworkButton targetChainId={Chains[chain]} />
          )}

          <Tooltip
            isDisabled={!(startTimeDiff > 0 || endTimeDiff < 0)}
            label={
              startTimeDiff > 0 ? "Claim hasn't started yet" : "Claim already ended"
            }
            hasArrow
            shouldWrapChildren
          >
            <CollectNftButton
              isDisabled={startTimeDiff > 0 || endTimeDiff > 0}
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
                    {...capacityTimeTagStyleProps}
                  />
                  <CircleDivider />
                </>
              )}

              {rolePlatform?.startTime && startTimeDiff > 0 && (
                <>
                  <StartTimeTag
                    startTime={rolePlatform?.startTime}
                    {...capacityTimeTagStyleProps}
                  />
                  <CircleDivider />
                </>
              )}

              {rolePlatform?.endTime && (
                <>
                  <EndTimeTag
                    endTime={rolePlatform?.endTime}
                    {...capacityTimeTagStyleProps}
                  />
                  <CircleDivider />
                </>
              )}

              {typeof rolePlatform?.capacity !== "number" && (
                <>
                  <Tag {...capacityTimeTagStyleProps} colorScheme="gray">
                    {`${
                      new Intl.NumberFormat("en", {
                        notation: "standard",
                      }).format(totalCollectors) ?? 0
                    } collected`}
                  </Tag>
                  <CircleDivider />
                </>
              )}

              <Tag {...capacityTimeTagStyleProps} colorScheme="gray">
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
