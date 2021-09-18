import { Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import useTokenData from "hooks/useTokenData"
import { nfts } from "temporaryData/nfts"
import { Requirement, RequirementTypeColors } from "temporaryData/types"

type Props = {
  requirement: Requirement
}

const RequirementCard = ({ requirement }: Props): JSX.Element => {
  const {
    data: [tokenName, tokenSymbol],
  } = useTokenData(requirement.address)

  let cardTitle = ""

  switch (requirement.type) {
    case "NFT":
    case "CRYPTOPUNKS":
    case "BAYC":
    case "LOOT":
    case "COOLCATS":
      cardTitle = `Own a(n) ${nfts.find((_) => _.type === requirement.type).name}`
      requirement.value &&
        requirement.data &&
        (cardTitle += ` with ${requirement.value} ${requirement.data}`)
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
    <ColorCard color={RequirementTypeColors[requirement.type]}>
      <Text fontWeight="bold" letterSpacing="wide">
        {cardTitle}
      </Text>
    </ColorCard>
  )
}

export default RequirementCard
