import { Box, CloseButton, HStack, Spinner, Text } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import { getRequirementLabel } from "components/create-guild/Requirements/formCards"
import { PropsWithChildren } from "react"
import { RequirementType, RequirementTypeColors } from "types"
import useBalancy from "../create-guild/Requirements/hooks/useBalancy"

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
          label={getRequirementLabel(type)}
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
