import {
  Box,
  Icon,
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
import { CaretDown, Plus, X } from "phosphor-react"
import { forwardRef, useId } from "react"
import { useController, UseControllerProps } from "react-hook-form"
import { SelectOption } from "types"
import ComboboxList from "./ComboboxList"
import { ComboboxOptionsProvider } from "./ComboboxOptionsContext"

type Props = InputProps & {
  options?: SelectOption[]
  isLoading?: boolean
  onChange?: (newValue: string) => void
  beforeOnChange?: (newValue: SelectOption) => void
  onClear?: () => void
  leftAddon?: JSX.Element
  rightAddon?: JSX.Element
  isClearable?: boolean
  isCreatable?: boolean
}

const Combobox = forwardRef(
  (
    {
      options: optionsProp = [],
      beforeOnChange,
      onChange: onChangeProp,
      onClear,
      isLoading,
      leftAddon,
      rightAddon,
      isClearable,
      isCreatable,
      ...htmlInputProps
    }: Props,
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
        onSelect: ({ value }) => {
          beforeOnChange?.(options?.find((option) => option.value === value))
          onChangeProp?.(value)
        },
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
    } = combobox.connect(state, send, normalizeProps)

    const { size, ...filteredInputProps } = inputProps
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { style, id, ...filteredPositionerProps } = positionerProps

    const htmlInputPropValue = htmlInputProps.value?.toString() ?? ""

    const options =
      isCreatable && inputValue?.length
        ? [
            ...optionsProp,
            {
              label: inputValue,
              value: inputValue,
              img: (
                <Icon
                  as={Plus}
                  boxSize={5}
                  padding={0.5}
                  position="relative"
                  top={1}
                />
              ),
              isCreateOption: true,
            },
          ]
        : optionsProp

    const selectedOption =
      selectedValue || htmlInputPropValue
        ? options?.find(
            (option) =>
              option.value === (selectedValue ?? htmlInputPropValue) ||
              option.isCreateOption
          ) ?? {
            label: htmlInputPropValue,
            value: htmlInputPropValue,
            img: undefined,
          }
        : undefined

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    )

    const shouldShowRightElement = Boolean(
      isLoading || (isClearable && (inputValue?.length || htmlInputPropValue))
    )

    return (
      <>
        <Box w="full" {...rootProps}>
          <Box ref={referenceRef} position="relative" {...controlProps}>
            <InputGroup>
              {leftAddon}
              {typeof selectedOption?.img === "string" && (
                <InputLeftElement>
                  <OptionImage img={selectedOption.img} alt={selectedOption.label} />
                </InputLeftElement>
              )}
              <Input
                ref={ref}
                htmlSize={size}
                pr={shouldShowRightElement ? 14 : 10}
                {...(htmlInputProps.isReadOnly ? undefined : filteredInputProps)}
                {...htmlInputProps}
                value={selectedOption?.label ?? htmlInputPropValue}
              />
              {shouldShowRightElement && (
                <InputRightElement mr={6} opacity={htmlInputProps.isDisabled && 0.4}>
                  {/* TODO: dynamic size */}
                  {isLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <IconButton
                      aria-label="Clear value"
                      variant="ghost"
                      icon={<X />}
                      boxSize={6}
                      minW="none"
                      onClick={() => {
                        onClear?.()
                        setValue("")
                      }}
                    />
                  )}
                </InputRightElement>
              )}
              {rightAddon}
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

  return <Combobox {...props} {...field} onClear={() => field.onChange("")} />
}

export { Combobox, ControlledCombobox }
