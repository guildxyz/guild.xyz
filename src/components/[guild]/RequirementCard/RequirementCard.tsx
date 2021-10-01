import { Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import useNftsList from "components/create-guild/NftFormCard/hooks/useNftsList"
import { Requirement, RequirementTypeColors } from "temporaryData/types"
import SnapshotStrategy from "./components/SnapshotStrategy"
import Token from "./components/Token"

type Props = {
  requirement: Requirement
}
const RequirementCard = ({ requirement }: Props): JSX.Element => {
  const nfts = useNftsList()

  return (
    <ColorCard color={RequirementTypeColors[requirement.type]}>
      <Text fontWeight="bold" letterSpacing="wide">
        {(() => {
          if (nfts?.map((nft) => nft.info.type).includes(requirement.type)) {
            return `Own a(n) ${
              nfts?.find((nft) => nft.info.type === requirement.type).info.name
            } ${
              requirement.value && requirement.data
                ? `with ${requirement.value} ${requirement.data}`
                : ""
            }`
          }

          switch (requirement.type) {
            case "POAP":
              return `Own the ${requirement.value} POAP`

            case "TOKEN":
            case "ETHER":
              return <Token requirement={requirement} />

            case "SNAPSHOT":
              return <SnapshotStrategy requirement={requirement} />
          }
        })()}
      </Text>
    </ColorCard>
  )
}

export default RequirementCard
