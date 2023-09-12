import {
  Box,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Wrap,
} from "@chakra-ui/react"
import * as combobox from "@zag-js/combobox"
import { normalizeProps, useMachine } from "@zag-js/react"
import { CaretDown, X } from "phosphor-react"
import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { useActivityLog } from "../../ActivityLogContext"
import {
  isSupportedQueryParam,
  SupportedSearchOption,
  SUPPORTED_SEARCH_OPTIONS,
  useActivityLogFilters,
} from "./ActivityLogFiltersContext"
import Dropdown from "./Dropdown"
import FilterTag from "./FilterTag"
import Suggestion from "./Suggestion"

const getPositionerCSSVariables = (
  element: HTMLDivElement
): Record<string, string> => {
  if (!element) return {}
  const style = getComputedStyle(element)
  const { position, width, top, left, transform } = style
  return { position, width, top, left, transform }
}

const FiltersInput = (): JSX.Element => {
  const { isUserActivityLog } = useActivityLog()

  const rootBgColor = useColorModeValue("white", "blackAlpha.300")

  const { activeFilters, addFilter, removeLastFilter, clearFilters } =
    useActivityLogFilters()
  const renderedActiveFilters = activeFilters.filter((f) =>
    SUPPORTED_SEARCH_OPTIONS.includes(f.filter as SupportedSearchOption)
  )

  const [state, send] = useMachine(
    combobox.machine({
      id: "filter-input-combobox",
      placeholder: "Filter by...",
      inputBehavior: "autohighlight",
      positioning: {
        placement: "bottom-start",
        sameWidth: true,
      },
      onSelect({ value }) {
        if (!isSupportedQueryParam(value)) return

        addFilter({
          filter: value,
          value: "",
        })

        setInputValue("")
      },
      openOnClick: true,
      loop: true,
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
    inputValue,
    setInputValue,
    focus,
    isFocused,
  } = combobox.connect(state, send, normalizeProps)

  useEffect(() => {
    if (!isFocused) return
    // Opening the suggestions dropdown
    send({ type: "CLICK_INPUT" })
  }, [isFocused])

  const { size, ...filteredInputProps } = inputProps

  const [shouldRemoveLastFilter, setShouldRemoveLastFilter] = useState(false)

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== "Backspace" || e.currentTarget.selectionStart !== 0) {
      setShouldRemoveLastFilter(false)
      return
    }

    if (shouldRemoveLastFilter) {
      removeLastFilter()
      if (activeFilters.length < 1) setShouldRemoveLastFilter(false)
      return
    }

    setShouldRemoveLastFilter(true)
  }

  const positionerRef = useRef<HTMLDivElement>()
  const [positionerStyle, setPositionerStyle] = useState<Record<string, string>>({})
  const rawPositionerStyle = getPositionerCSSVariables(positionerRef.current)

  useEffect(() => {
    if (rawPositionerStyle.transform !== "none")
      setPositionerStyle(rawPositionerStyle)
  }, [rawPositionerStyle.transform])

  const shouldRenderRoleSuggestions =
    !isUserActivityLog && !activeFilters?.some((af) => af.filter === "roleId")

  const shouldRenderRewardSuggestions =
    !isUserActivityLog &&
    !activeFilters?.some((af) => af.filter === "rolePlatformId")

  return (
    <>
      <Box
        px={2}
        bgColor={rootBgColor}
        borderWidth={1}
        borderRadius="lg"
        _focusWithin={{
          boxShadow: "0 0 0 1px var(--chakra-colors-gray-500)",
        }}
        {...rootProps}
      >
        <HStack {...controlProps}>
          <Wrap w="full" py="2">
            {renderedActiveFilters?.map(({ id }) => (
              <FilterTag
                key={id}
                filterId={id}
                isFiltersInputFocused={isFocused}
                focusFiltersInput={focus}
                positionerStyle={positionerStyle}
              />
            ))}
            <Input
              variant="unstyled"
              px={2}
              flex={1}
              minW="max-content"
              htmlSize={size}
              onKeyUp={onKeyUp}
              {...filteredInputProps}
            />
          </Wrap>

          {(activeFilters.length > 0 || inputValue.length > 0) && (
            <IconButton
              aria-label="Clear filters"
              icon={<X />}
              size="sm"
              boxSize={6}
              minW={6}
              minH={6}
              borderRadius="full"
              variant="ghost"
              onClick={() => {
                clearFilters(["userId", "roleId", "rolePlatformId", "action"])
                setInputValue("")
              }}
            />
          )}

          <IconButton
            aria-label="Show filter options"
            icon={<CaretDown />}
            size="sm"
            boxSize={6}
            minW={6}
            minH={6}
            borderRadius="full"
            variant="ghost"
            {...triggerProps}
          />
        </HStack>
      </Box>
      <Dropdown ref={positionerRef} {...positionerProps}>
        <Stack spacing={0} {...contentProps}>
          {!isUserActivityLog && (
            <Suggestion
              label="User"
              {...getOptionProps({ label: "User", value: "userId" })}
            >
              <Text as="span" colorScheme="gray" fontWeight="normal" noOfLines={1}>
                Filter by wallet addresses
              </Text>
            </Suggestion>
          )}

          {shouldRenderRoleSuggestions && (
            <Suggestion
              label="Role"
              {...getOptionProps({ label: "Role", value: "roleId" })}
            >
              <Text as="span" colorScheme="gray" fontWeight="normal" noOfLines={1}>
                Filter by role
              </Text>
            </Suggestion>
          )}

          {shouldRenderRewardSuggestions && (
            <Suggestion
              label="Reward"
              {...getOptionProps({ label: "Reward", value: "rolePlatformId" })}
            >
              <Text as="span" colorScheme="gray" fontWeight="normal" noOfLines={1}>
                Filter by reward
              </Text>
            </Suggestion>
          )}

          <Suggestion
            label="Action"
            {...getOptionProps({ label: "Action", value: "action" })}
          >
            <Text as="span" colorScheme="gray" fontWeight="normal" noOfLines={1}>
              Filter by action
            </Text>
          </Suggestion>
        </Stack>
      </Dropdown>
    </>
  )
}

export default FiltersInput
