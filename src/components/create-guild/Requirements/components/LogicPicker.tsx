import { Divider, HStack, Select, useColorMode } from "@chakra-ui/react"
import { useController, useFormContext } from "react-hook-form"
import { GuildFormType } from "types"

// size prop so the select width can be dynamic
const options = [
  {
    value: "AND",
    size: "68px",
  },
  {
    value: "OR",
    size: "60px",
  },
  {
    value: "NAND",
    size: "80px",
  },
  {
    value: "NOR",
    size: "68px",
  },
]

const LogicPicker = () => {
  const { colorMode } = useColorMode()
  const { control } = useFormContext<GuildFormType>()

  const { field } = useController({
    control,
    name: "logic",
    defaultValue: "AND",
  })

  return (
    <HStack py={2} width="full" w="full" spacing="4">
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.400"}
      />
      <Select
        maxW={options.find((option) => option.value === field.value).size}
        flexShrink={0}
        size="xs"
        borderColor="transparent"
        bg="unset"
        // rootProps={{ sx: { select: { paddingInlineEnd: "0 !important" } } }}
        fontWeight="bold"
        color={colorMode === "light" ? "blackAlpha.500" : "whiteAlpha.400"}
        {...field}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        ))}
      </Select>
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.400"}
      />
    </HStack>
  )
}

export default LogicPicker
