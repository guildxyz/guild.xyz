import {
  Box,
  Button,
  Card,
  Collapse,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { CaretDown } from "phosphor-react"
import { ReactNode } from "react"
import RequirementImage from "./RequirementImage"

type Props = {
  isImageLoading?: boolean
  image?: string | JSX.Element
  withImgBg?: boolean
  title: ReactNode
}

const OriginalRequirementPreview = ({
  isImageLoading,
  withImgBg,
  image,
  title,
}: Props) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Box position="relative">
      <Button
        size={"xs"}
        variant={"ghost"}
        rightIcon={<CaretDown />}
        aria-label="view original"
        mt={-2}
        ml={-2}
        opacity={0.5}
        colorScheme="gray"
        onClick={onToggle}
      >
        View original
      </Button>
      <Collapse in={isOpen}>
        <Card w={"full"} background={"gray.700"}>
          <HStack p={2} gap={4}>
            <RequirementImage
              isImageLoading={isImageLoading}
              withImgBg={withImgBg}
              image={image}
            />
            <Text wordBreak="break-word">{title}</Text>
          </HStack>
        </Card>
      </Collapse>
    </Box>
  )
}

export default OriginalRequirementPreview
