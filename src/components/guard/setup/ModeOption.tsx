import { Box, Flex, Heading, useColorMode, useRadio } from "@chakra-ui/react"
import Button from "components/common/Button"

const ModeOption = (props): JSX.Element => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { title, isChecked } = props

  const { colorMode } = useColorMode()

  return (
    <Button
      as="fieldset"
      {...checkbox}
      w="full"
      h="auto"
      p="0"
      flexDir="column"
      alignItems="strech"
      borderRadius="none"
      _first={{ borderTopRadius: "xl" }}
      _last={{ borderBottomRadius: "xl" }}
      boxShadow="none !important"
      border="2px"
      bg={
        colorMode === "light"
          ? (isChecked && "indigo.50") || "white"
          : (isChecked && "gray.700") || null
      }
      borderColor={isChecked ? "DISCORD.500" : "transparent"}
      _hover={{
        bg: isChecked
          ? null
          : colorMode === "light"
          ? "blackAlpha.50"
          : "whiteAlpha.100",
      }}
      _active={{ bg: null }}
    >
      <Flex as="label" py="4" px="5" cursor="pointer" alignItems="center">
        <input {...input} />
        <Box whiteSpace="break-spaces" w="full">
          <Heading size="sm">{title}</Heading>
        </Box>
      </Flex>
    </Button>
  )
}

export default ModeOption
