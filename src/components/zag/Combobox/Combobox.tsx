import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Spinner,
  useColorModeValue,
  usePopper,
} from "@chakra-ui/react"
import * as combobox from "@zag-js/combobox"
import { normalizeProps, Portal, useMachine } from "@zag-js/react"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { CaretDown } from "phosphor-react"
import { forwardRef, useId } from "react"
import { useController, UseControllerProps } from "react-hook-form"
import { SelectOption } from "types"
import ComboboxList from "./ComboboxList"
import { ComboboxOptionsProvider } from "./ComboboxOptionsContext"

type Props = InputProps & {
  options?: SelectOption[]
  isLoading?: boolean
  onChange?: (newValue: string) => void
}

const Combobox = forwardRef(
  (
    { options = [], onChange: onChangeProp, isLoading, ...htmlInputProps }: Props,
    ref: any
  ): JSX.Element => {
    const dropdownBgColor = useColorModeValue("white", "gray.700")
    const dropdownBorderColor = useColorModeValue("gray.200", "gray.500")
    const dropdownShadow = useColorModeValue("lg", "dark-lg")

    const { popperRef, referenceRef } = usePopper({
      matchWidth: true,
      placement: "bottom-start",
      offset: [0, 8],
    })

    const [state, send] = useMachine(
      combobox.machine({
        id: useId(),
        name: htmlInputProps.name,
        loop: true,
        openOnClick: true,
        positioning: {
          sameWidth: true,
        },
        onSelect: ({ value }) => onChangeProp?.(value),
      })
    )

    const {
      rootProps,
      controlProps,
      inputProps,
      triggerProps,
      positionerProps,
      contentProps,
      getOptionProps,
      focusedOption,
      selectedValue,
      inputValue,
      setValue,
      setInputValue,
    } = combobox.connect(state, send, normalizeProps)

    const { size, ...filteredInputProps } = inputProps
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { style, id, ...filteredPositionerProps } = positionerProps

    const selectedOption =
      inputValue?.length && options?.find((option) => option.value === selectedValue)

    const filteredOptions = selectedOption
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        )

    return (
      <>
        <Box w="full" {...rootProps}>
          <Box ref={referenceRef} position="relative" {...controlProps}>
            <InputGroup>
              {typeof selectedOption?.img === "string" && (
                <InputLeftElement>
                  <OptionImage img={selectedOption.img} alt={selectedOption.label} />
                </InputLeftElement>
              )}
              <Input
                ref={ref}
                htmlSize={size}
                pr={10}
                {...(htmlInputProps.isReadOnly ? undefined : filteredInputProps)}
                {...htmlInputProps}
                // TODO: is this the best solution for this?... also, this won't trigger a setValue("") if we type in another letter for example
                onKeyUp={(e) => {
                  if (e.code !== "Backspace" || !selectedValue) return
                  setValue("")
                  setInputValue((e.target as HTMLInputElement).value)
                }}
              />
              {isLoading && (
                <InputRightElement mr={6} opacity={htmlInputProps.isDisabled && 0.4}>
                  {/* TODO: dynamic size */}
                  <Spinner size="sm" />
                </InputRightElement>
              )}
            </InputGroup>
            <IconButton
              aria-label="Open dropdown"
              position="absolute"
              top="50%"
              right={2}
              transform="translateY(-50%)"
              size={htmlInputProps.size}
              icon={<CaretDown />}
              variant="unstyled"
              display="flex"
              alignItems="center"
              boxSize={6}
              minW="none"
              opacity={htmlInputProps.isDisabled && 0.4}
              {...(htmlInputProps.isDisabled || htmlInputProps.isReadOnly
                ? undefined
                : triggerProps)}
            />
          </Box>
        </Box>

        <Portal>
          {options.length > 0 && (
            <Box
              ref={popperRef}
              maxH={72}
              bgColor={dropdownBgColor}
              borderColor={dropdownBorderColor}
              shadow={dropdownShadow}
              borderWidth={1}
              borderRadius="md"
              zIndex="modal"
              {...filteredPositionerProps}
            >
              <Box m={0} fontWeight="medium" {...contentProps}>
                <ComboboxOptionsProvider
                  options={filteredOptions}
                  getOptionProps={getOptionProps}
                  focusedOption={focusedOption}
                >
                  <ComboboxList />
                </ComboboxOptionsProvider>
              </Box>
            </Box>
          )}
        </Portal>
      </>
    )
  }
)

const ControlledCombobox = ({
  name,
  rules,
  shouldUnregister,
  defaultValue,
  control,
  ...props
}: Props & UseControllerProps): JSX.Element => {
  const { field } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
  })

  const { value, ...filteredFieldProps } = field
  console.log("value", value)

  return <Combobox {...props} {...filteredFieldProps} />
}

export { Combobox, ControlledCombobox }
