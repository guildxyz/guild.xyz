import { Box, Flex, useColorModeValue } from "@chakra-ui/react"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { FixedSizeList } from "react-window"
import { useComboboxOptions } from "./ComboboxOptionsContext"

const ITEM_SIZE = 40
const MAX_HEIGHT = 288

const ComboboxList = (): JSX.Element => {
  const { options } = useComboboxOptions()

  return (
    <FixedSizeList
      itemCount={options.length}
      itemSize={ITEM_SIZE}
      height={Math.min(MAX_HEIGHT, options.length * ITEM_SIZE)}
      className="custom-scrollbar"
    >
      {Row}
    </FixedSizeList>
  )
}

type RowProps = {
  style: Record<string, any>
  index: number
}

const Row = ({ style, index }: RowProps): JSX.Element => {
  const { options, getOptionProps, focusedOption } = useComboboxOptions()
  const item = options[index]
  const optionFocusBgColor = useColorModeValue("blackAlpha.100", "gray.600")

  return (
    <Flex
      style={style}
      key={`${item.value}:${index}`}
      alignItems="center"
      px={3}
      py={2}
      bgColor={focusedOption?.value === item.value ? optionFocusBgColor : undefined}
      _hover={{
        bgColor: optionFocusBgColor,
      }}
      transition="0.16s ease"
      {...getOptionProps({
        label: item.label,
        value: item.value,
        index,
        disabled: item.disabled,
      })}
    >
      {item.img && (
        <Box mr={2}>
          {typeof item.img === "string" ? (
            <OptionImage img={item.img} alt={item.label} />
          ) : (
            item.img
          )}
        </Box>
      )}
      {item.label}
    </Flex>
  )
}

export default ComboboxList
