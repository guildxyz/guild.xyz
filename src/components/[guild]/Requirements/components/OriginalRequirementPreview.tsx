import { HStack, Text } from "@chakra-ui/react"
import { ReactNode } from "react"
import RequirementImage from "./RequirementImage"
import ResetRequirementButton from "./ResetRequirementButton"

type Props = {
  id: number
  isImageLoading?: boolean
  image?: string | JSX.Element
  withImgBg?: boolean
  title: ReactNode
  isOpen: boolean
  showReset?: boolean
}

const OriginalRequirementPreview = ({
  isImageLoading,
  withImgBg,
  image,
  title,
  showReset = false,
}: Props) => (
  <HStack p={3} gap={4}>
    <RequirementImage
      isImageLoading={isImageLoading}
      withImgBg={withImgBg}
      image={image}
    />
    <Text wordBreak="break-word" flexGrow={1}>
      {title}
    </Text>
    {showReset && <ResetRequirementButton />}
  </HStack>
)

export default OriginalRequirementPreview
