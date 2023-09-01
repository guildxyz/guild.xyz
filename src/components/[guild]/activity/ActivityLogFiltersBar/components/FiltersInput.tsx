import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import * as combobox from "@zag-js/combobox"
import { normalizeProps, useMachine } from "@zag-js/react"
import { CaretDown, X } from "phosphor-react"
import { KeyboardEvent, useEffect, useRef, useState } from "react"
import {
  isSupportedQueryParam,
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
  const rootBgColor = useColorModeValue("white", "blackAlpha.300")

  const { activeFilters, addFilter, removeLastFilter, clearFilters, triggerSearch } =
    useActivityLogFilters()

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
    inputValue,
    setInputValue,
    focus,
  } = combobox.connect(state, send, normalizeProps)

  const { size, ...filteredInputProps } = inputProps

  const [shouldRemoveLastFilter, setShouldRemoveLastFilter] = useState(false)

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      triggerSearch()
    }

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

  const shouldRenderRoleSuggestions = !activeFilters?.some(
    (af) => af.filter === "roleId"
  )

  const shouldRenderRewardSuggestions = !activeFilters?.some(
    (af) => af.filter === "rolePlatformId"
  )

  return (
    <>
      <Box
        h={10}
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
          <Flex
            alignItems="center"
            w="full"
            h={10}
            overflowX="auto"
            className="invisible-scrollbar"
          >
            <HStack>
              {activeFilters?.map(({ id }) => (
                <FilterTag
                  key={id}
                  filterId={id}
                  focusFiltersInput={focus}
                  positionerStyle={positionerStyle}
                />
              ))}
            </HStack>
            <Input
              variant="unstyled"
              px={2}
              minW="max-content"
              htmlSize={size}
              onKeyUp={onKeyUp}
              {...filteredInputProps}
            />
          </Flex>

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
                clearFilters()
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
          <Suggestion
            label="User"
            isFocused={focusedOption?.value === "userId"}
            {...getOptionProps({ label: "User", value: "userId" })}
          >
            <Text as="span" colorScheme="gray" fontWeight="normal">
              Filter by wallet addresses
            </Text>
          </Suggestion>

          {shouldRenderRoleSuggestions && (
            <Suggestion
              label="Role"
              isFocused={focusedOption?.value === "roleId"}
              {...getOptionProps({ label: "Role", value: "roleId" })}
            >
              <Text as="span" colorScheme="gray" fontWeight="normal">
                Filter by role
              </Text>
            </Suggestion>
          )}

          {shouldRenderRewardSuggestions && (
            <Suggestion
              label="Reward"
              isFocused={focusedOption?.value === "rolePlatformId"}
              {...getOptionProps({ label: "Reward", value: "rolePlatformId" })}
            >
              <Text as="span" colorScheme="gray" fontWeight="normal">
                Filter by reward
              </Text>
            </Suggestion>
          )}

          <Suggestion
            label="Action"
            isFocused={focusedOption?.value === "action"}
            {...getOptionProps({ label: "Action", value: "action" })}
          >
            <Text as="span" colorScheme="gray" fontWeight="normal">
              Filter by action
            </Text>
          </Suggestion>
        </Stack>
      </Dropdown>
    </>
  )
}

export default FiltersInput
