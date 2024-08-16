import {
  Box,
  Center,
  Collapse,
  Flex,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react"
import { ArrowDown, ArrowUp } from "@phosphor-icons/react"
import Button from "components/common/Button"
import { useEffect, useState } from "react"
import parseDescription from "utils/parseDescription"
import { RoleCardCollapseProps } from ".."

const MAX_INITIAL_DESCRIPTION_HEIGHT = 160

type Props = {
  description: string
} & RoleCardCollapseProps

const RoleDescription = (props: Props) => {
  const { description, descriptionRef } = props

  const descriptionHeight =
    descriptionRef.current?.getBoundingClientRect().height || 24

  if (descriptionHeight <= MAX_INITIAL_DESCRIPTION_HEIGHT)
    return (
      <Box ref={descriptionRef} px={5} pb={3} wordBreak="break-word">
        {parseDescription(description)}
      </Box>
    )

  return <CollapsableRoleDescription {...props} />
}

const CollapsableRoleDescription = ({
  description,
  descriptionRef,
  initialRequirementsRef,
  isExpanded,
  onToggleExpanded,
}: Props) => {
  const [maxInitialReqsHeight, setMaxInitialReqsHeight] = useState(
    MAX_INITIAL_DESCRIPTION_HEIGHT
  )

  useEffect(() => {
    if (!initialRequirementsRef.current) return

    const observer = new ResizeObserver((entries) => {
      const reqsHeight = entries[0].contentRect.height
      if (reqsHeight > MAX_INITIAL_DESCRIPTION_HEIGHT)
        setMaxInitialReqsHeight(MAX_INITIAL_DESCRIPTION_HEIGHT)
    })

    observer.observe(initialRequirementsRef.current)

    return () => {
      observer.disconnect()
    }
  }, [initialRequirementsRef])

  const shadowColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-800)"
  )
  const buttonWrapperBg = useColorModeValue("white", "gray.700")
  const buttonColor = useColorModeValue("blackAlpha.500", "gray.400")

  const BUTTON_DEFAULT_STYLES = {
    opacity: 0,
    transform: "translateY(10px)",
  }
  const BUTTON_HOVER_STYLES = {
    opacity: 1,
    transform: !isExpanded && "translateY(0px)",
  }

  return (
    <Collapse
      in={isExpanded}
      startingHeight={maxInitialReqsHeight}
      style={{ position: "relative" }}
    >
      <Box
        ref={descriptionRef}
        px={5}
        pb={10}
        wordBreak="break-word"
        {...(!isExpanded && { cursor: "pointer", onClick: onToggleExpanded })}
        _hover={{ "+ .expand": BUTTON_HOVER_STYLES }}
      >
        {parseDescription(description)}
      </Box>

      <Center
        className="expand"
        pos="absolute"
        bottom={2}
        left={0}
        right={0}
        zIndex={1}
        transition="opacity .1s, transform .1s"
        {...(isExpanded ? BUTTON_HOVER_STYLES : BUTTON_DEFAULT_STYLES)}
        _hover={BUTTON_HOVER_STYLES}
      >
        <Flex borderRadius={"md"} bg={buttonWrapperBg} p="1px" shadow="sm">
          <Button
            size="xs"
            color={buttonColor}
            borderRadius="md"
            onClick={onToggleExpanded}
            textTransform="uppercase"
            fontWeight="bold"
            rightIcon={<Icon as={isExpanded ? ArrowUp : ArrowDown} />}
          >
            {isExpanded ? "Collapse" : "Click to expand"}
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
    </Collapse>
  )
}

export default RoleDescription
