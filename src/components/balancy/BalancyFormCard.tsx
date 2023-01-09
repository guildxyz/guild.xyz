import { Box, CloseButton, HStack, Spinner, Text } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import IsNegatedPicker from "components/create-guild/Requirements/components/IsNegatedPicker"
import { PropsWithChildren } from "react"
import REQUIREMENTS, { RequirementType } from "requirements"
import useBalancy from "../create-guild/Requirements/hooks/useBalancy"

const RequirementTypeColors = {
  ERC721: "var(--chakra-colors-green-400)",
  ERC1155: "var(--chakra-colors-green-400)",
  NOUNS: "var(--chakra-colors-green-400)",
  ERC20: "var(--chakra-colors-indigo-400)",
  COIN: "var(--chakra-colors-indigo-400)",
  ALLOWLIST: "var(--chakra-colors-gray-200)",
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
          <IsNegatedPicker baseFieldPath={baseFieldPath} />
          {children}
        </Box>
        <ColorCardLabel
          type={type}
          backgroundColor={RequirementTypeColors[type]}
          label={REQUIREMENTS[type].name.toUpperCase()}
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
