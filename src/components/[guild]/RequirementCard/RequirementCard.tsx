import { Box, Image, Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import Link from "components/common/Link"
import ThinCard from "components/common/thinCard"
import isNumber from "components/common/utils/isNumber"
import { motion } from "framer-motion"
import JSConfetti from "js-confetti"
import { Requirement, RequirementTypeColors } from "temporaryData/types"
import SnapshotStrategy from "./components/SnapshotStrategy"
import Token from "./components/Token"
import Whitelist from "./components/Whitelist"

type Props = {
  requirement: Requirement
}
const RequirementCard = ({ requirement }: Props): JSX.Element => {
  // TODO: The application will handle this type of values in a different way in the future, we'll need to change this later!
  let minmax
  try {
    minmax = JSON.parse(requirement?.value?.toString())
  } catch (_) {
    minmax = null
  }

  const dragEvent = () => {
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti()
  }
  const MotionBox = motion(Box)
  return (
    <ThinCard>
      <Box position="absolute">
        <Image src="https://i.imgur.com/C30NS2k.png" maxH="20" alt="Helmet" />
      </Box>
      <MotionBox
        zIndex={7}
        width="full"
        drag="x"
        onDragEnd={() => dragEvent()}
        dragConstraints={{
          left: 0,
          right: 100,
        }}
      >
        <ColorCard color={RequirementTypeColors[requirement.type]}>
          {(() => {
            switch (requirement.type) {
              case "ERC721":
                return requirement.key ? (
                  <Text fontWeight="bold" letterSpacing="wide">{`Own a(n) ${
                    requirement.symbol === "-" &&
                    requirement.address?.toLowerCase() ===
                      "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
                      ? "ENS"
                      : requirement.name
                  } ${
                    requirement.value && requirement.key
                      ? `with ${
                          Array.isArray(minmax) &&
                          minmax.length === 2 &&
                          minmax.every(isNumber)
                            ? `${minmax[0]}-${minmax[1]}`
                            : requirement.value
                        } ${requirement.key}`
                      : ""
                  }`}</Text>
                ) : (
                  <Text fontWeight="bold" letterSpacing="wide">
                    {`Own a(n) `}
                    <Link
                      href={`https://etherscan.io/token/${requirement.address}`}
                      isExternal
                      title="View on Etherscan"
                    >
                      {requirement.symbol === "-" &&
                      requirement.address?.toLowerCase() ===
                        "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
                        ? "ENS"
                        : requirement.name}
                    </Link>
                    {` NFT`}
                  </Text>
                )
              case "POAP":
                return (
                  <Text
                    fontWeight="bold"
                    letterSpacing="wide"
                  >{`Own the ${requirement.value} POAP`}</Text>
                )
              case "ERC20":
              case "ETHER":
                return <Token requirement={requirement} />
              case "SNAPSHOT":
                return <SnapshotStrategy requirement={requirement} />
              case "WHITELIST":
                return (
                  <Whitelist
                    whitelist={
                      Array.isArray(requirement.value) ? requirement.value : []
                    }
                  />
                )
            }
          })()}
        </ColorCard>
      </MotionBox>
    </ThinCard>
  )
}

export default RequirementCard
