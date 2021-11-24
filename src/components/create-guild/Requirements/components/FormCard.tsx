import { CloseButton, VStack } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ColorCard from "components/common/ColorCard"
import { PropsWithChildren, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { RequirementType, RequirementTypeColors } from "temporaryData/types"
import RequirementChainTypeText from "./RequirementChainTypeText"

type Props = {
  type: RequirementType
  index: number
  onRemove?: () => void
}

const FormCard = ({
  type,
  index,
  onRemove,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { register, unregister } = useFormContext()

  useEffect(() => {
    register(`requirements.${index}`)
    return () => unregister(`requirements.${index}`)
  }, [])

  return (
    <CardMotionWrapper>
      <ColorCard color={RequirementTypeColors[type]}>
        {typeof onRemove === "function" && (
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
        )}
        <VStack spacing={4} alignItems="start" pt={4}>
          {children}
        </VStack>
        <RequirementChainTypeText
          requirementType={type}
          top={"-px"}
          left={"-px"}
          borderTopLeftRadius="2xl"
          borderBottomRightRadius="xl"
        />
      </ColorCard>
    </CardMotionWrapper>
  )
}

export default FormCard
