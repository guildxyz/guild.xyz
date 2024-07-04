import {
  Box,
  Flex,
  RadioProps,
  Text,
  UseRadioGroupProps,
  chakra,
  useBreakpointValue,
  useColorModeValue,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useId, useMemo } from "react"

type SegmentedControlOption = {
  label: string
  value: unknown
}
type Props<TOption extends SegmentedControlOption> = {
  options: TOption[]
  size?: "md" | "sm"
  onChange?: (nextValue: TOption["value"]) => void
  value?: TOption["value"]
  defaultValue?: TOption["value"]
} & Omit<UseRadioGroupProps, "onChange" | "value" | "defaultValue">

const SegmentedControl = <TOption extends SegmentedControlOption>({
  options,
  size = "md",
  ...useRadioGroupProps
}: Props<TOption>) => {
  const bgColor = useColorModeValue("white", "blackAlpha.300")
  const borderWidth = useColorModeValue(1, 0)

  const { getRadioProps, getRootProps } = useRadioGroup({
    ...useRadioGroupProps,
    value: useRadioGroupProps.value as any,
    defaultValue: (useRadioGroupProps.defaultValue ?? options[0].value) as any,
  })

  const uid = useId()

  const height = useMemo(() => {
    if (size === "md") return { base: "fit", md: 10 }
    return { base: "fit", md: 9 }
  }, [size])

  return (
    <Flex
      width="full"
      flexDirection={{ base: "column", md: "row" }}
      borderWidth={borderWidth}
      bgColor={bgColor}
      borderRadius="lg"
      height={height}
      padding={1}
      gap={1}
      {...getRootProps()}
    >
      {options.map((option) => (
        <SegmentedControlButton
          uid={uid}
          key={option.value.toString()}
          {...getRadioProps({ value: option.value })}
          label={option.label}
          value={option.value as any}
          size={size}
        />
      ))}
    </Flex>
  )
}

const MotionBox = motion(Box)

const SegmentedControlButton = ({
  uid,
  label,
  size = "md",
  ...useRadioProps
}: SegmentedControlOption & RadioProps & { uid: string; size?: "md" | "sm" }) => {
  const { state, getInputProps, getRadioProps, htmlProps } = useRadio(useRadioProps)

  const inputProps = getInputProps({})

  const activeBgColor = useColorModeValue("blackAlpha.100", "whiteAlpha.200")

  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <chakra.label
      {...htmlProps}
      cursor="pointer"
      position="relative"
      h="full"
      w="full"
    >
      <input {...inputProps} hidden />

      {state.isChecked && (
        <MotionBox
          position="absolute"
          inset={0}
          borderRadius="md"
          backgroundColor={activeBgColor}
          layoutId={`${uid}-segmented-bg`}
          transition={{
            duration: 0.2,
          }}
          // Don't animate on the Y axis
          style={isMobile ? {} : { originY: "0px" }}
        />
      )}
      <Flex
        alignItems="center"
        justifyContent="center"
        h="full"
        borderRadius="md"
        w="full"
        fontWeight="medium"
        tabIndex={0}
        _focusVisible={{
          outline: "none",
          boxShadow: "outline",
        }}
        {...getRadioProps()}
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "Space") {
            e.preventDefault()
          }
        }}
        onKeyUp={(e) => {
          if (e.code === "Enter" || e.code === "Space") {
            e.preventDefault()
            inputProps.onChange(useRadioProps.value as any)
          }
        }}
        textAlign="center"
        px={2}
      >
        <Text
          as="span"
          noOfLines={1}
          fontSize={size}
          colorScheme={!state.isChecked ? "gray" : ""}
        >
          {label}
        </Text>
      </Flex>
    </chakra.label>
  )
}

export default SegmentedControl
