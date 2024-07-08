import {
  Box,
  Flex,
  FlexProps,
  RadioProps,
  Text,
  UseRadioGroupProps,
  chakra,
  useColorModeValue,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useId, useMemo } from "react"

type SegmentedControlOption = {
  label: string
  value: unknown
  isFullWidth?: boolean
}
type Props<TOption extends SegmentedControlOption> = {
  options: TOption[]
  size?: "md" | "sm"
  isFullWidth?: boolean
  styleProps?: FlexProps
  onChange?: (nextValue: TOption["value"]) => void
  value?: TOption["value"]
  defaultValue?: TOption["value"]
} & Omit<UseRadioGroupProps, "onChange" | "value" | "defaultValue">

const SegmentedControl = <TOption extends SegmentedControlOption>({
  options,
  size = "md",
  isFullWidth = true,
  styleProps,
  ...useRadioGroupProps
}: Props<TOption>) => {
  const bgColor = useColorModeValue("gray.100", "blackAlpha.300")
  const borderWidth = useColorModeValue(1, 0)

  const { getRadioProps, getRootProps } = useRadioGroup({
    ...useRadioGroupProps,
    value: useRadioGroupProps.value as any,
    defaultValue: (useRadioGroupProps.defaultValue ?? options[0].value) as any,
  })

  const uid = useId()

  const height = useMemo(() => {
    if (size === "md") return 10
    return 9
  }, [size])

  return (
    <Flex
      width="full"
      borderWidth={borderWidth}
      alignItems={"center"}
      bgColor={bgColor}
      borderRadius="lg"
      height={height}
      padding={1}
      gap={1}
      {...styleProps}
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
          isFullWidth={isFullWidth}
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
  isFullWidth,
  ...useRadioProps
}: SegmentedControlOption & RadioProps & { uid: string; size?: "md" | "sm" }) => {
  const { state, getInputProps, getRadioProps, htmlProps } = useRadio(useRadioProps)

  const inputProps = getInputProps({})

  const activeBgColor = useColorModeValue("white", "whiteAlpha.200")

  return (
    <chakra.label
      {...htmlProps}
      cursor="pointer"
      position="relative"
      h="full"
      w={isFullWidth ? "full" : "auto"}
      flexShrink={!isFullWidth ? 0 : "auto"}
    >
      <input {...inputProps} hidden />

      {state.isChecked && (
        <MotionBox
          position="absolute"
          inset={0}
          borderRadius="lg"
          backgroundColor={activeBgColor}
          boxShadow={"0 0.5px 2px 0 rgba(0, 0, 0, 0.2)"}
          layoutId={`${uid}-segmented-bg`}
          transition={{
            duration: 0.2,
          }}
          // Don't animate on the Y axis
          style={{ originY: "0px" }}
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
        px={3}
        pos="relative"
        zIndex="1"
      >
        <Text
          as="span"
          noOfLines={1}
          fontSize={size}
          fontWeight={!isFullWidth ? "semibold" : undefined}
          colorScheme={!state.isChecked ? "gray" : ""}
        >
          {label}
        </Text>
      </Flex>
    </chakra.label>
  )
}

export default SegmentedControl
