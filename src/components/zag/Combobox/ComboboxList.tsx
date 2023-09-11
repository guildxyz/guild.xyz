import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { FixedSizeList } from "react-window"
import { useComboboxOptions } from "./ComboboxOptionsContext"

const ITEM_SIZE = 40
const MAX_HEIGHT = 288

type Props = {
  noOptionsText?: string
}

const ComboboxList = ({ noOptionsText = "No options" }: Props): JSX.Element => {
  const { options } = useComboboxOptions()

  if (!options.length)
    return (
      <Flex alignItems="center" justifyContent="center" py={2}>
        {noOptionsText}
      </Flex>
    )

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
  const { options, getOptionProps } = useComboboxOptions()
  const item = options[index]
  const optionFocusBgColor = useColorModeValue("blackAlpha.100", "gray.600")

  const optionProps = {
    ...getOptionProps({
      label: item.label,
      value: item.value,
      index,
      disabled: item.disabled,
    }),
  }

  return (
    <Flex
      style={style}
      key={`${item.value}:${index}`}
      alignItems="center"
      px={3}
      py={2}
      bgColor={optionProps["aria-selected"] ? optionFocusBgColor : undefined}
      _hover={{
        bgColor: optionFocusBgColor,
      }}
      transition="0.16s ease"
      {...optionProps}
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
      <Text as="span" isTruncated>
        {item.label}
      </Text>
    </Flex>
  )
}

export default ComboboxList
