import { VStack } from "@chakra-ui/react"
import React from "react"
import { Logic, Requirement } from "types"
import LogicDivider from "../LogicDivider"
import AllowlistRequirementCard from "./components/AllowlistRequirementCard"
import FreeRequirementCard from "./components/FreeRequirementCard"
import JuiceboxRequirementCard from "./components/JuiceboxRequirementCard"
import MirrorRequirementCard from "./components/MirrorRequirementCard"
import NftRequirementCard from "./components/NftRequirementCard"
import PoapRequirementCard from "./components/PoapRequirementCard"
import SnapshotRequirementCard from "./components/SnapshotRequirementCard"
import TokenRequirementCard from "./components/TokenRequirementCard"

const REQUIREMENT_CARDS = {
  FREE: FreeRequirementCard,
  ERC20: TokenRequirementCard,
  COIN: TokenRequirementCard,
  ERC721: NftRequirementCard,
  ERC1155: NftRequirementCard,
  UNLOCK: NftRequirementCard,
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

const Requirements = ({ requirements, logic }: Props) => (
  <VStack maxW="md" mt={6}>
    {requirements?.map((requirement, i) => {
      const RequirementCard = REQUIREMENT_CARDS[requirement.type]

      if (RequirementCard)
        return (
          <React.Fragment key={i}>
            <RequirementCard requirement={requirement} />
            {i < requirements.length - 1 && <LogicDivider logic={logic} />}
          </React.Fragment>
        )
    })}
  </VStack>
)

export default Requirements
