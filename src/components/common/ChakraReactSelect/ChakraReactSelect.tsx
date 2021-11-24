/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Box,
  Center,
  CloseButton,
  createIcon,
  Divider,
  Flex,
  MenuIcon,
  PropsOf,
  Spinner,
  StylesProvider,
  Tag,
  TagCloseButton,
  TagLabel,
  useColorModeValue,
  useFormControl,
  useMultiStyleConfig,
  useStyles,
  useTheme,
} from "@chakra-ui/react"
import React, { cloneElement, ReactElement } from "react"
import CustomSelectOption from "./CustomSelectOption"
import {
  ChakraSelectProps,
  OptionalTheme,
  RecursiveCSSObject,
  SelectedOptionStyle,
  Size,
  SizeProps,
  SxProps,
  TagVariant,
  Theme,
} from "./types"

// Taken from the @chakra-ui/icons package to prevent needing it as a dependency
// https://github.com/chakra-ui/chakra-ui/blob/main/packages/icons/src/ChevronDown.tsx
const ChevronDown = createIcon({
  displayName: "ChevronDownIcon",
  d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
})

// Use the CheckIcon component from the chakra menu
// https://github.com/chakra-ui/chakra-ui/blob/main/packages/menu/src/menu.tsx#L301
const CheckIcon: React.FC<PropsOf<"svg">> = (props) => (
  <svg viewBox="0 0 14 14" width="1em" height="1em" {...props}>
    <polygon
      fill="currentColor"
      points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"
    />
  </svg>
)

// Custom styles for components which do not have a chakra equivalent
const chakraStyles: ChakraSelectProps["styles"] = {
  // When disabled, react-select sets the pointer-state to none which prevents
  // the `not-allowed` cursor style from chakra from getting applied to the
  // Control
  container: (provided) => ({
    ...provided,
    pointerEvents: "auto",
  }),
  input: (provided) => ({
    ...provided,
    color: "inherit",
    lineHeight: 1,
  }),
  menu: (provided) => ({
    ...provided,
    boxShadow: "none",
  }),
  valueContainer: (provided, { selectProps: { size } }) => {
    const px: SizeProps = {
      sm: "0.75rem",
      md: "1rem",
      lg: "1rem",
    }

    return {
      ...provided,
      padding: `0.125rem ${px[size as Size]}`,
    }
  },
  loadingMessage: (provided, { selectProps: { size } }) => {
    const fontSizes: SizeProps = {
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
    }

    const paddings: SizeProps = {
      sm: "6px 9px",
      md: "8px 12px",
      lg: "10px 15px",
    }

    return {
      ...provided,
      fontSize: fontSizes[size as Size],
      padding: paddings[size as Size],
    }
  },
  // Add the chakra style for when a TagCloseButton has focus
  multiValueRemove: (
    provided,
    {
      // @ts-ignore For some reason isFocused is not recognized as a prop here
      // but it works
      isFocused,
      selectProps: { multiValueRemoveFocusStyle },
    }
  ) => (isFocused ? multiValueRemoveFocusStyle : {}),
  // "color" prop is needed in order to provide the proper color for the text inside the Select component!
  singleValue: ({ color, ...provided }) => provided,
  control: () => ({}),
  menuList: () => ({}),
  option: () => ({}),
  multiValue: () => ({}),
  multiValueLabel: () => ({}),
  group: () => ({}),
}

const chakraComponents: ChakraSelectProps["components"] = {
  // Control components
  Control: ({
    children,
    innerRef,
    innerProps,
    isDisabled,
    isFocused,
    selectProps: { size, isInvalid },
  }) => {
    const inputStyles = useMultiStyleConfig("Input", { size })

    const heights: SizeProps = {
      sm: 8,
      md: 10,
      lg: 12,
    }

    return (
      <StylesProvider value={inputStyles}>
        <Flex
          ref={innerRef}
          className="chakra-react-select-control"
          sx={{
            ...inputStyles.field,
            p: 0,
            overflow: "hidden",
            h: "auto",
            minH: heights[size as Size],
          }}
          {...innerProps}
          data-focus={isFocused ? true : undefined}
          data-invalid={isInvalid ? true : undefined}
          data-disabled={isDisabled ? true : undefined}
        >
          {children}
        </Flex>
      </StylesProvider>
    )
  },
  MultiValueContainer: ({ children, innerRef, innerProps, data, selectProps }) => (
    <Tag
      ref={innerRef}
      {...innerProps}
      m="0.125rem"
      // react-select Fixed Options example:
      // https://react-select.com/home#fixed-options
      variant={
        data.variant || selectProps.tagVariant || (data.isFixed ? "solid" : "subtle")
      }
      colorScheme={data.colorScheme || selectProps.colorScheme}
      size={selectProps.size}
    >
      {children}
    </Tag>
  ),
  MultiValueLabel: ({ children, innerRef, innerProps }) => (
    <TagLabel ref={innerRef} {...innerProps}>
      {children}
    </TagLabel>
  ),
  MultiValueRemove: ({ children, innerRef, innerProps, data: { isFixed } }) => {
    if (isFixed) {
      return null
    }

    return (
      <TagCloseButton ref={innerRef} {...innerProps} tabIndex={-1}>
        {children}
      </TagCloseButton>
    )
  },
  IndicatorSeparator: ({ innerProps }) => (
    <Divider {...innerProps} orientation="vertical" opacity="1" />
  ),
  ClearIndicator: ({ innerProps }) => (
    <CloseButton {...innerProps} size="sm" mx={1} rounded="full" tabIndex={-1} />
  ),
  DropdownIndicator: ({ innerProps, selectProps: { size } }) => {
    const { addon } = useStyles()

    const iconSizes: SizeProps = {
      sm: 4,
      md: 5,
      lg: 6,
    }
    const iconSize = iconSizes[size as Size]

    return (
      <Center
        {...innerProps}
        sx={{
          ...addon,
          h: "100%",
          borderRadius: 0,
          borderWidth: 0,
          cursor: "pointer",
        }}
      >
        <ChevronDown h={iconSize} w={iconSize} />
      </Center>
    )
  },
  LoadingIndicator: ({ innerProps, selectProps: { size } }) => {
    const spinnerSizes: SizeProps = {
      sm: "xs",
      md: "sm",
      lg: "md",
    }

    const spinnerSize = spinnerSizes[size as Size]

    return <Spinner mr={3} {...innerProps} size={spinnerSize} />
  },
  // Menu components
  Menu: ({
    children,
    innerProps,
    innerRef,
    // @ts-ignore `placement` is not recognized as a prop but it's essential
    // for the menu placement (and it is passed)
    placement,
    selectProps: { size },
  }) => {
    const menuStyles = useMultiStyleConfig("Menu", {})

    const chakraTheme = useTheme()
    const borderRadii: SizeProps = {
      sm: chakraTheme.radii.sm,
      md: chakraTheme.radii.md,
      lg: chakraTheme.radii.md,
    }

    return (
      <Box
        ref={innerRef}
        sx={{
          position: "absolute",
          ...(placement === "bottom" && { top: "100%" }),
          ...(placement === "top" && { bottom: "100%" }),
          my: "8px",
          w: "100%",
          zIndex: 1,
          overflow: "visible",
          rounded: borderRadii[size as Size],
        }}
        {...innerProps}
      >
        <StylesProvider value={menuStyles}>{children}</StylesProvider>
      </Box>
    )
  },
  MenuList: ({ innerRef, children, maxHeight, selectProps: { size } }) => {
    const { list } = useStyles()

    const chakraTheme = useTheme()
    const borderRadii: SizeProps = {
      sm: chakraTheme.radii.sm,
      md: chakraTheme.radii.md,
      lg: chakraTheme.radii.md,
    }

    return (
      <Box
        sx={{
          ...list,
          maxH: `${maxHeight}px`,
          overflowY: "auto",
          borderRadius: borderRadii[size as Size],
        }}
        ref={innerRef}
        className="custom-scrollbar"
      >
        {children}
      </Box>
    )
  },
  GroupHeading: ({
    innerProps,
    children,
    selectProps: { size, hasStickyGroupHeaders },
  }) => {
    const {
      groupTitle,
      list: { bg },
    } = useStyles()

    const chakraTheme = useTheme()
    const fontSizes: SizeProps = {
      sm: chakraTheme.fontSizes.xs,
      md: chakraTheme.fontSizes.sm,
      lg: chakraTheme.fontSizes.md,
    }
    const paddings: SizeProps = {
      sm: "0.4rem 0.8rem",
      md: "0.5rem 1rem",
      lg: "0.6rem 1.2rem",
    }

    return (
      <Box
        sx={{
          ...groupTitle,
          fontSize: fontSizes[size as Size],
          p: paddings[size as Size],
          m: 0,
          borderBottomWidth: hasStickyGroupHeaders ? "1px" : 0,
          position: hasStickyGroupHeaders ? "sticky" : "static",
          top: -2,
          bg,
        }}
        {...innerProps}
      >
        {children}
      </Box>
    )
  },
  Option: ({
    innerRef,
    innerProps,
    children,
    isFocused,
    isDisabled,
    isSelected,
    selectProps: {
      size,
      isMulti,
      hideSelectedOptions,
      selectedOptionStyle,
      selectedOptionColor,
    },
  }) => {
    const { item } = useStyles()

    const paddings: SizeProps = {
      sm: "0.3rem 0.6rem",
      md: "0.4rem 0.8rem",
      lg: "0.5rem 1rem",
    }

    // Use the same selected color as the border of the select component
    // https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/components/input.ts#L73
    const selectedBg = useColorModeValue(
      `${selectedOptionColor}.500`,
      `${selectedOptionColor}.300`
    )
    const selectedColor = useColorModeValue("white", "black")

    // Don't create exta space for the checkmark if using a multi select with
    // options that dissapear when they're selected
    const showCheckIcon: boolean =
      selectedOptionStyle === "check" && (!isMulti || hideSelectedOptions === false)

    const shouldHighlight: boolean = selectedOptionStyle === "color" && isSelected

    return (
      <Flex
        role="button"
        sx={{
          ...item,
          alignItems: "center",
          w: "100%",
          textAlign: "start",
          fontSize: size,
          p: paddings[size as Size],
          bg: isFocused
            ? (item as RecursiveCSSObject<SxProps>)._focus.bg
            : "transparent",
          ...(shouldHighlight && {
            bg: selectedBg,
            color: selectedColor,
            _active: { bg: selectedBg },
          }),
          ...(isDisabled && (item as RecursiveCSSObject<SxProps>)._disabled),
        }}
        ref={innerRef}
        {...innerProps}
        disabled={isDisabled ? true : undefined}
      >
        {showCheckIcon && (
          <MenuIcon
            fontSize="0.8em"
            marginEnd="0.75rem"
            opacity={isSelected ? 1 : 0}
          >
            <CheckIcon />
          </MenuIcon>
        )}
        {children}
      </Flex>
    )
  },
}

const ChakraReactSelect = ({
  children,
  styles = {},
  components = {},
  theme,
  size = "md",
  colorScheme = "gray",
  isDisabled,
  isInvalid,
  inputId,
  tagVariant = undefined as TagVariant,
  hasStickyGroupHeaders = false as boolean,
  selectedOptionStyle = "color" as SelectedOptionStyle,
  selectedOptionColor = "blue",
  ...props
}: ChakraSelectProps): ReactElement => {
  const chakraTheme = useTheme()

  // Combine the props passed into the component with the props that can be set
  // on a surrounding form control to get the values of `isDisabled` and
  // `isInvalid`
  const inputProps = useFormControl({ isDisabled, isInvalid })

  // The chakra theme styles for TagCloseButton when focused
  const closeButtonFocus = chakraTheme.components.Tag.baseStyle.closeButton._focus
  const multiValueRemoveFocusStyle = {
    background: closeButtonFocus.bg,
    boxShadow: chakraTheme.shadows[closeButtonFocus.boxShadow],
  }

  // The chakra UI global placeholder color
  // https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/styles.ts#L13
  const placeholderColor = useColorModeValue(
    chakraTheme.colors.gray[400],
    chakraTheme.colors.whiteAlpha[400]
  )

  // Ensure that the size used is one of the options, either `sm`, `md`, or `lg`
  let realSize: Size = size
  const sizeOptions: Size[] = ["sm", "md", "lg"]
  if (!sizeOptions.includes(size)) {
    realSize = "md"
  }

  // Ensure that the tag variant used is one of the options, either `subtle`,
  // `solid`, or `outline` (or undefined)
  let realTagVariant: TagVariant = tagVariant
  const tagVariantOptions: TagVariant[] = ["subtle", "solid", "outline"]
  if (tagVariant !== undefined) {
    if (!tagVariantOptions.includes(tagVariant)) {
      realTagVariant = "subtle"
    }
  }

  // Ensure that the tag variant used is one of the options, either `subtle`,
  // `solid`, or `outline` (or undefined)
  let realSelectedOptionStyle: SelectedOptionStyle = selectedOptionStyle
  const selectedOptionStyleOptions: SelectedOptionStyle[] = ["color", "check"]
  if (!selectedOptionStyleOptions.includes(selectedOptionStyle)) {
    realSelectedOptionStyle = "color"
  }

  // Ensure that the color used for the selected options is a string
  let realSelectedOptionColor: string = selectedOptionColor
  if (typeof selectedOptionColor !== "string") {
    realSelectedOptionColor = "blue"
  }

  const select = cloneElement(children, {
    components: {
      ...chakraComponents,
      ...components,
      Option: CustomSelectOption,
    },
    styles: {
      ...chakraStyles,
      ...styles,
      container: (provided) => ({
        ...provided,
        width: "100%",
      }),
      input: (provided) => ({
        ...provided,
        maxWidth: 0,
        color: "inherit",
        lineHeight: 1,
      }),
      placeholder: (provided) => ({
        ...provided,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }),
    },
    theme: (baseTheme: Theme) => {
      let propTheme: OptionalTheme = {}
      if (typeof theme === "function") {
        propTheme = theme(baseTheme)
      }

      return {
        ...baseTheme,
        ...propTheme,
        colors: {
          ...baseTheme.colors,
          neutral50: placeholderColor, // placeholder text color
          neutral40: placeholderColor, // noOptionsMessage color
          ...propTheme.colors,
        },
        spacing: {
          ...baseTheme.spacing,
          ...propTheme.spacing,
        },
      }
    },
    colorScheme,
    size: realSize,
    tagVariant: realTagVariant,
    selectedOptionStyle: realSelectedOptionStyle,
    selectedOptionColor: realSelectedOptionColor,
    multiValueRemoveFocusStyle,
    // isDisabled and isInvalid can be set on the component
    // or on a surrounding form control
    isDisabled: inputProps.disabled,
    isInvalid: !!inputProps["aria-invalid"],
    inputId: inputId || inputProps.id,
    hasStickyGroupHeaders,
    ...props,
    // aria-invalid can be passed to react-select, so we allow that to
    // override the `isInvalid` prop
    "aria-invalid":
      props["aria-invalid"] ?? inputProps["aria-invalid"] ? true : undefined,
    menuPortalTarget: document?.querySelector("body"),
  })

  return select
}

export default ChakraReactSelect
