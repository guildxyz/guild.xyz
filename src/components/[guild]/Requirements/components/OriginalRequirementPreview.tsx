import { Card, HStack, Text, useColorModeValue } from "@chakra-ui/react"
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
}: Props) => {
  const bg = useColorModeValue("gray.100", "gray.600")
  const border = useColorModeValue("gray.200", "gray.500")

  return (
    <Card w={"full"} background={bg} border={"1px"} borderColor={border}>
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
}

export default OriginalRequirementPreview
