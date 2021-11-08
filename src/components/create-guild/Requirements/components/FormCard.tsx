import { CloseButton, VStack } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ColorCard from "components/common/ColorCard"
import { PropsWithChildren } from "react"

type Props = {
  color: string
  onRemove?: () => void
}

const FormCard = ({
  color,
  onRemove,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <CardMotionWrapper>
    <ColorCard color={color} height="full">
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
      <VStack spacing={4} alignItems="start">
        {children}
      </VStack>
    </ColorCard>
  </CardMotionWrapper>
)

export default FormCard
