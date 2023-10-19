import { Box, Skeleton, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import AnyOfHeader from "components/[guild]/Requirements/components/AnyOfHeader"
import { TransactionStatusProvider } from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusContext"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import CollectNftButton from "components/[guild]/collect/components/CollectNftButton"
import { useCollectNftContext } from "components/[guild]/collect/components/CollectNftContext"
import Card from "components/common/Card"
import { Chains } from "connectors"
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

  const { chain, nftAddress, alreadyCollected } = useCollectNftContext()
  const { totalCollectors, totalCollectorsToday, isLoading } = useNftDetails(
    chain,
    nftAddress
  )

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
          <TransactionStatusProvider>
            <CollectNftButton label="Collect now" colorScheme="green" />
          </TransactionStatusProvider>
        </Stack>

        <Skeleton
          maxW="max-content"
          isLoaded={
            !isLoading &&
            typeof totalCollectors !== "undefined" &&
            typeof totalCollectorsToday !== "undefined"
          }
        >
          <Text fontSize="sm" colorScheme="gray" fontWeight="medium">
            {`${
              new Intl.NumberFormat("en", {
                notation: "standard",
              }).format(totalCollectors) ?? 0
            } collected - ${
              new Intl.NumberFormat("en", {
                notation: "standard",
              }).format(totalCollectorsToday) ?? 0
            } collected today`}
          </Text>
        </Skeleton>
      </Stack>
    </Card>
  )
}

export default RequirementsCard
