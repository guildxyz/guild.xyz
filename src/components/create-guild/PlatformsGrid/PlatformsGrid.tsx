import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react"
import OptionCard from "components/common/OptionCard"
import platforms from "platforms"
import { PlatformName } from "types"
import BaseOAuthSelectButton from "./components/BaseOAuthSelectButton"

type Props = {
  onSelection: (platform: PlatformName) => void
  columns?: SimpleGridProps["columns"]
}

const platformsData = Object.fromEntries(
  Object.entries(platforms)
    .filter(([, platfromData]) => !!platfromData.gatedEntity)
    .map(([platformName, platformData]) => [
      platformName,
      {
        Btn:
          platformData.CreationGridSelectButton ??
          (({ onSelection }: { onSelection: Props["onSelection"] }) => (
            <BaseOAuthSelectButton
              platform={platformName as PlatformName}
              onSelection={onSelection}
            />
          )),
        description: platformData.creationDescription,
      },
    ])
)

const PlatformsGrid = ({ onSelection, columns = { base: 1, md: 2 } }: Props) => (
  <SimpleGrid columns={columns} gap={{ base: 4, md: 6 }}>
    {Object.entries(platformsData).map(([platformName, { description, Btn }]) => (
      <OptionCard
        key={platformName}
        size="lg"
        title={platforms[platformName].name}
        image={`/platforms/${platformName.toLowerCase()}.png`}
        bgImage={`/platforms/${platformName.toLowerCase()}_bg.png`}
        description={description}
      >
        {Btn && <Btn onSelection={onSelection} />}
      </OptionCard>
    ))}
  </SimpleGrid>
)

export default PlatformsGrid
