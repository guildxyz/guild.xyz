import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
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

// const Row = ({ index, style }) => (
//   <div style={style}>Row {index}</div>
// );

// const Example = () => (
//   <List
//     height={150}
//     itemCount={1000}
//     itemSize={35}
//     width={300}
//   >
//     {Row}
//   </List>
// );

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

    // const [renderedOptions, setRenderedOptions] = useState(options)

    const { popperRef, referenceRef } = usePopper({
      matchWidth: true,
      placement: "bottom-start",
    })

    const [state, send] = useMachine(
      combobox.machine({
        id: useId(),
        name: htmlInputProps.name,
        loop: true,
        openOnClick: true,
        autoFocus: true,
        positioning: {
          sameWidth: true,
        },
        onOpen: () => {
          // setRenderedOptions(options)
        },
        onInputChange: ({ value }) => {
          // const filtered = options.filter((option) =>
          //   option.label.toLowerCase().includes(value.toLowerCase())
          // )
          // setRenderedOptions(filtered.length > 0 ? filtered : options)
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
                {...filteredInputProps}
                {...htmlInputProps}
                // TODO: is this the best solution for this?... also, this won't trigger a setValue("") if we type in another letter for example
                onKeyUp={(e) => {
                  if (e.code !== "Backspace" || !selectedValue) return
                  setValue("")
                  setInputValue((e.target as HTMLInputElement).value)
                }}
              />
            </InputGroup>
            <IconButton
              aria-label="Open dropdown"
              position="absolute"
              top="50%"
              right={1}
              transform="translateY(-50%)"
              size={htmlInputProps.size}
              icon={<CaretDown />}
              variant="unstyled"
              display="flex"
              alignItems="center"
              {...triggerProps}
            />
          </Box>
        </Box>

        <Portal>
          {options.length > 0 && (
            <Box
              ref={popperRef}
              h={72}
              bgColor={dropdownBgColor}
              borderColor={dropdownBorderColor}
              shadow={dropdownShadow}
              borderWidth={1}
              borderRadius="md"
              zIndex="modal"
              // overflowY="auto"

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
