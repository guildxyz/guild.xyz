import { CloseButton, Flex, VStack } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ColorCard from "components/common/ColorCard"
import { PropsWithChildren } from "react"
import { RequirementType, RequirementTypeColors } from "temporaryData/types"
import RequirementTypeText from "./RequirementTypeText"

type Props = {
  type: RequirementType
  onRemove?: () => void
}

const FormCard = ({
  type,
  onRemove,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <CardMotionWrapper>
    <ColorCard
      color={RequirementTypeColors[type]}
      height="full"
      pb="0!important"
      overflow="hidden"
    >
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
      <Flex direction="column" height="full">
        <VStack spacing={4} alignItems="start">
          {children}
        </VStack>
        <RequirementTypeText requirementType={type} />
      </Flex>
    </ColorCard>
  </CardMotionWrapper>
)

export default FormCard
