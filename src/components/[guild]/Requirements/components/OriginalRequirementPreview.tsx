import { Card, HStack, Text } from "@chakra-ui/react"
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
  id,
  isImageLoading,
  withImgBg,
  image,
  title,
  showReset = false,
}: Props) => (
  <Card w={"full"} background={"gray.600"} border={"1px"} borderColor={"gray.500"}>
    <HStack p={3} gap={4}>
      <RequirementImage
        isImageLoading={isImageLoading}
        withImgBg={withImgBg}
        image={image}
      />
      <Text wordBreak="break-word" flexGrow={1}>
        {title}
      </Text>
      {showReset && <ResetRequirementButton id={id} />}
    </HStack>
  </Card>
)

export default OriginalRequirementPreview
