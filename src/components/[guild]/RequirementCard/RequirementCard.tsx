import { Text, useColorMode, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import useTokenData from "hooks/useTokenData"
import { nfts } from "temporaryData/nfts"
import { Requirement, RequirementTypeColors } from "temporaryData/types"

type Props = {
  requirement: Requirement
}

const RequirementCard = ({ requirement }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const {
    data: [tokenName, tokenSymbol],
  } = useTokenData(requirement.address)

  // We could extract this logic into a hook later if needed
  let cardTitle = ""

  // TODO
  switch (requirement.type) {
    case "NFT":
      cardTitle = `Own a(n) ${
        nfts.find((_) => _.address === requirement.address).name
      } with ${requirement.value} ${requirement.data}`
      break
    case "POAP":
      cardTitle = `Own the ${requirement.value} POAP`
      break
    case "TOKEN":
      cardTitle = `Hold at least ${requirement.value} ${tokenSymbol}`
      break
    default:
      cardTitle = ""
  }

  return (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, sm: 7 }}
      py="7"
      w="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderWidth={2}
      borderColor={RequirementTypeColors[requirement.type]}
      // _before={{
      //   content: `""`,
      //   position: "absolute",
      //   top: 0,
      //   bottom: 0,
      //   left: 0,
      //   right: 0,
      //   bg: "primary.300",
      //   opacity: 0,
      //   transition: "opacity 0.2s",
      // }}
      // _hover={{
      //   _before: {
      //     opacity: 0.1,
      //   },
      // }}
      // _active={{
      //   _before: {
      //     opacity: 0.17,
      //   },
      // }}
    >
      <VStack spacing={4} alignItems="start">
        <Text fontWeight="bold" letterSpacing="wide">
          {cardTitle}
        </Text>
      </VStack>
    </Card>
  )
}

export default RequirementCard
