import { Skeleton, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import { useCollectNftContext } from "components/[guild]/Requirements/components/GuildCheckout/components/CollectNftContext"
import CollectNftButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/CollectNftButton"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import Card from "components/common/Card"
import { Fragment } from "react"
import { Logic, Requirement } from "types"
import useNftDetails from "../hooks/useNftDetails"
import CollectNftFeesTable from "./CollectNftFeesTable"

type Props = {
  requirements: Requirement[]
  logic: Logic
}

const RequirementsCard = ({ requirements, logic }: Props) => {
  const requirementsSectionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const requirementsSectionBorderColor = useColorModeValue("gray.200", "gray.600")

  const { chain, address } = useCollectNftContext()
  const { data, isValidating } = useNftDetails(chain, address)

  const padding = { base: 5, sm: 6, lg: 7, xl: 8 }

  return (
    <Card w="full" h="max-content">
      <Stack
        p={padding}
        bgColor={requirementsSectionBgColor}
        spacing={{ base: 4, md: 8 }}
        w="full"
        alignItems="center"
        borderBottomWidth={1}
        borderColor={requirementsSectionBorderColor}
      >
        <Text
          as="span"
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
          {requirements.map((requirement, i) => (
            <Fragment key={requirement.id}>
              <RequirementDisplayComponent requirement={requirement} />
              {i < requirements.length - 1 && <LogicDivider logic={logic} />}
            </Fragment>
          ))}
        </Stack>
      </Stack>

      <Stack p={padding} w="full" alignItems="center" spacing={4}>
        <CollectNftFeesTable bgColor={requirementsSectionBgColor} />

        <CollectNftButton label="Collect now" colorScheme="green" />

        {(data || isValidating) && (
          <Skeleton maxW="max-content" isLoaded={!isValidating && !!data}>
            <Text fontSize="sm" colorScheme="gray" fontWeight="medium">
              {`${
                new Intl.NumberFormat("en", {
                  notation: "standard",
                }).format(data?.totalCollectors) ?? 0
              } collected - ${
                new Intl.NumberFormat("en", {
                  notation: "standard",
                }).format(data?.totalCollectorsToday) ?? 0
              } collected today`}
            </Text>
          </Skeleton>
        )}
      </Stack>
    </Card>
  )
}

export default RequirementsCard
