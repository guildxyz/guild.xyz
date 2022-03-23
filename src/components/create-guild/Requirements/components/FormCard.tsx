import { CloseButton, HStack, Spinner, Text, VStack } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ColorCard from "components/common/ColorCard"
import useTokenData from "hooks/useTokenData"
import { PropsWithChildren } from "react"
import { useWatch } from "react-hook-form"
import { RequirementType, RequirementTypeColors } from "types"
import useBalancy from "../hooks/useBalancy"
import RequirementChainTypeText from "./RequirementChainTypeText"

type Props = {
  index: number
  type: RequirementType
  onRemove: () => void
}

const FormCard = ({
  type,
  index,
  onRemove,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { holders, isLoading } = useBalancy(index)

  const chain = useWatch({ name: `requirements.${index}.chain` })
  const amount = useWatch({ name: `requirements.${index}.data.amount` })
  const address = useWatch({ name: `requirements.${index}.address` })
  const { data } = useTokenData(chain, address)

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
        <VStack spacing={4} alignItems="start" pt={4} h="full">
          {children}
        </VStack>
        <RequirementChainTypeText
          requirementType={type}
          top={"-px"}
          left={"-px"}
          borderTopLeftRadius="2xl"
          borderBottomRightRadius="xl"
        />

        {typeof holders === "number" ? (
          <HStack mt={5}>
            <Text color="gray">
              {isLoading ? <Spinner color="gray" size="xs" mx={1} /> : holders}{" "}
              {`${holders > 1 ? "addresses" : "address"} ${
                holders > 1 ? "satisfy" : "satisfies"
              } this requirement`}
            </Text>
            {/*<Tooltip
                label={
                  holders > 1
                    ? `There are ${holders} addresses on ${chain} with ${amount} ${data?.symbol}`
                    : `There is ${
                        holders === 1 ? "one" : "zero"
                      } address on ${chain} with ${amount} ${data?.symbol}`
                }
              >
                <Info color="gray" />
              </Tooltip>*/}
          </HStack>
        ) : (
          isLoading && <Spinner color="gray" size="sm" mt={5} />
        )}
      </ColorCard>
    </CardMotionWrapper>
  )
}

export default FormCard
