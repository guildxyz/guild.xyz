import {
  Box,
  Center,
  Collapse,
  Flex,
  Icon,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { ArrowDown, ArrowUp } from "phosphor-react"
import parseDescription from "utils/parseDescription"

const MAX_REQUIREMENTS_HEIGHT = 250

type Props = {
  description: string
  descriptionRef: any
  isExpanded: boolean
  onToggleExpanded: () => void
}

const RoleDescription = ({
  description,
  descriptionRef,
  isExpanded,
  onToggleExpanded,
}: Props) => {
  const descriptionHeight =
    descriptionRef.current?.getBoundingClientRect().height || 24
  // const [descriptionHeight, setDescriptionHeight] = useState(24)
  // useEffect(() => {
  //   if (descriptionRef.current)
  //     setDescriptionHeight(descriptionRef.current.getBoundingClientRect().height)
  // }, [descriptionRef])

  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-800)"
  )

  const { colorMode } = useColorMode()

  return (
    <Collapse
      in={isExpanded}
      startingHeight={
        descriptionHeight > MAX_REQUIREMENTS_HEIGHT
          ? MAX_REQUIREMENTS_HEIGHT
          : descriptionHeight
      }
      style={{ position: "relative" }}
    >
      <Box ref={descriptionRef} px={5} pb={3} wordBreak="break-word">
        {parseDescription(description)}
      </Box>
      {descriptionHeight > MAX_REQUIREMENTS_HEIGHT && (
        <>
          <Center
            className="expand"
            pos="absolute"
            bottom={2}
            left={0}
            right={0}
            zIndex={1}
          >
            <Flex
              borderRadius={"md"}
              bg={colorMode === "light" ? "white" : "gray.700"}
              p="1px"
              shadow="sm"
            >
              <Button
                size="xs"
                color={colorMode === "light" ? "blackAlpha.500" : "gray.400"}
                borderRadius="md"
                onClick={onToggleExpanded}
                textTransform="uppercase"
                fontWeight="bold"
                rightIcon={<Icon as={isExpanded ? ArrowUp : ArrowDown} />}
              >
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
            </Flex>
          </Center>

          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height={6}
            bgGradient={`linear-gradient(to top, ${shadowColor}, transparent)`}
            pointerEvents="none"
            opacity={isExpanded ? 0 : 0.6}
            transition="opacity 0.2s ease"
          />
        </>
      )}
    </Collapse>
  )
}

export default RoleDescription
