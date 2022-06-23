import { Box, Collapse, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { Logic, Requirement } from "types"
import LogicDivider from "../LogicDivider"
import AllowlistRequirementCard from "./components/AllowlistRequirementCard"
import ExpandRequirementsButton from "./components/ExpandRequirementsButton"
import FreeRequirementCard from "./components/FreeRequirementCard"
import JuiceboxRequirementCard from "./components/JuiceboxRequirementCard"
import MirrorRequirementCard from "./components/MirrorRequirementCard"
import NftRequirementCard from "./components/NftRequirementCard"
import PoapRequirementCard from "./components/PoapRequirementCard"
import SnapshotRequirementCard from "./components/SnapshotRequirementCard"
import TokenRequirementCard from "./components/TokenRequirementCard"
import UnlockRequirementCard from "./components/UnlockRequirementCard"

const REQUIREMENT_CARDS = {
  FREE: FreeRequirementCard,
  ERC20: TokenRequirementCard,
  COIN: TokenRequirementCard,
  ERC721: NftRequirementCard,
  ERC1155: NftRequirementCard,
  UNLOCK: UnlockRequirementCard,
  POAP: PoapRequirementCard,
  MIRROR: MirrorRequirementCard,
  SNAPSHOT: SnapshotRequirementCard,
  ALLOWLIST: AllowlistRequirementCard,
  JUICEBOX: JuiceboxRequirementCard,
}

type Props = {
  requirements: Requirement[]
  logic: Logic
}

const Requirements = ({ requirements, logic }: Props) => {
  const sliceIndex = requirements.length - 3
  const shownRequirements = requirements.slice(0, 3)
  const hiddenRequirements = requirements.slice(-sliceIndex)

  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false)

  return (
    <VStack mt={6}>
      {shownRequirements.map((requirement, i) => {
        const RequirementCard = REQUIREMENT_CARDS[requirement.type]

        if (RequirementCard)
          return (
            <Box key={i} w="full">
              <RequirementCard requirement={requirement} />
              {i < shownRequirements.length - 1 && <LogicDivider logic={logic} />}
            </Box>
          )
      })}

      <Collapse in={isRequirementsExpanded} animateOpacity style={{ width: "100%" }}>
        {hiddenRequirements.map((requirement, i) => {
          const RequirementCard = REQUIREMENT_CARDS[requirement.type]

          if (RequirementCard)
            return (
              <Box key={i} w="full">
                {i === 0 && <LogicDivider logic={logic} />}
                <RequirementCard requirement={requirement} />
                {i < hiddenRequirements.length - 1 && <LogicDivider logic={logic} />}
              </Box>
            )
        })}
      </Collapse>

      {hiddenRequirements.length > 0 && (
        <ExpandRequirementsButton
          hiddenRequirements={hiddenRequirements.length}
          isRequirementsExpanded={isRequirementsExpanded}
          setIsRequirementsExpanded={setIsRequirementsExpanded}
        />
      )}
    </VStack>
  )
}

export default Requirements
