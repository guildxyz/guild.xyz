import { Box, CloseButton, HStack, Spinner, Text } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import { PropsWithChildren } from "react"
import { RequirementType, RequirementTypeColors } from "types"
import useBalancy from "../create-guild/Requirements/hooks/useBalancy"

const typeLabel = (type) => {
  switch (type) {
    case "ERC1155":
    case "ERC721":
    case "NOUNS":
      return "NFT"

    case "CONTRACT":
      return "CONTRACT STATE"

    case "TWITTER_FOLLOW":
    case "TWITTER_BIO":
    case "TWITTER_NAME":
    case "TWITTER_FOLLOWER_COUNT":
      return "TWITTER"

    case "GITHUB_STARRING":
      return "GITHUB"

    case "GALAXY":
      return "GALXE"

    case "DISCORD_ROLE":
      return "DISCORD"

    case "LENS_PROFILE":
    case "LENS_FOLLOW":
    case "LENS_COLLECT":
    case "LENS_MIRROR":
      return "LENS"

    case "MIRROR_COLLECT":
      return "MIRROR"

    default:
      return type
  }
}
const typeColor = (type) => {
  switch (type) {
    case "ALLOWLIST":
      return "gray.700"

    case "GALAXY":
      return "white"

    case "101":
      return "white"

    default:
      return undefined
  }
}

type Props = {
  baseFieldPath: string
  type: RequirementType
  onRemove: () => void
}

const BalancyFormCard = ({
  type,
  baseFieldPath,
  onRemove,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { holders, isLoading } = useBalancy(baseFieldPath)

  return (
    <CardMotionWrapper>
      <ColorCard color={RequirementTypeColors[type]}>
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          width={8}
          height={8}
          rounded="full"
          aria-label="Remove requirement"
          zIndex="1"
          onClick={onRemove}
        />
        <Box pt={4} h="full">
          {children}
        </Box>
        <ColorCardLabel
          type={type}
          backgroundColor={RequirementTypeColors[type]}
          label={typeLabel(type)}
          color={typeColor(type)}
          top={"-px"}
          left={"-px"}
          borderTopLeftRadius="2xl"
          borderBottomRightRadius="xl"
        />

        {typeof holders === "number" ? (
          <HStack mt={5}>
            <Text color="gray">
              {isLoading ? (
                <Spinner color="gray" size="xs" mx={1} />
              ) : (
                <Text as="span" fontWeight={"medium"}>
                  {holders}
                </Text>
              )}{" "}
              {`${holders > 1 ? "addresses" : "address"} ${
                holders > 1 ? "satisfy" : "satisfies"
              } this requirement`}
            </Text>
          </HStack>
        ) : isLoading ? (
          <Spinner color="gray" size="sm" mt={5} />
        ) : (
          <Text color="gray" mt="5">
            Fill inputs to calculate eligible addresses
          </Text>
        )}
      </ColorCard>
    </CardMotionWrapper>
  )
}

export default BalancyFormCard
