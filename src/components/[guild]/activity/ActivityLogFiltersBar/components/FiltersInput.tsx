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
import { useRouter } from "next/router"
import { CaretDown, X } from "phosphor-react"
import { ParsedUrlQuery } from "querystring"
import { KeyboardEvent, useEffect, useState } from "react"
import ActionIcon from "../../ActivityLogAction/components/ActionIcon"
import {
  SupportedQueryParam,
  SUPPORTED_QUERY_PARAMS,
} from "../../ActivityLogContext"
import { ACTION } from "../../constants"
import { useActiveFiltersReducer } from "./hooks/useActiveFiltersReducer"
import TagInput from "./TagInput"

type SearchOption = {
  label: string
  description: string
  value: SupportedQueryParam
}

export type Filter = {
  filter: SupportedQueryParam
  value: string
}

const isSupportedQueryParam = (arg: any): arg is SupportedQueryParam =>
  typeof arg === "string" &&
  (SUPPORTED_QUERY_PARAMS.includes(arg as SupportedQueryParam) ||
    SUPPORTED_QUERY_PARAMS.includes(arg.split(":")[0] as SupportedQueryParam))

const searchOptions: SearchOption[] = [
  {
    label: "Users",
    description: "user IDs",
    value: "userId",
  },
  {
    label: "Role",
    description: "role ID",
    value: "roleId",
  },
  {
    label: "Requirement",
    description: "requirement ID",
    value: "requirementId",
  },
  {
    label: "Platform",
    description: "platform ID",
    value: "rolePlatformId",
  },
]

const hiddenActions: (keyof typeof ACTION)[] = [
  "UpdateUrlName",
  "UpdateLogoOrTitle",
  "UpdateDescription",
  "UpdateLogic",
  "UpdateTheme",
]

const auditLogActions = Object.entries(ACTION)
  .filter(([actionType]) => !hiddenActions.includes(ACTION[actionType]))
  .map(([, actionName]) => actionName)

const FiltersInput = (): JSX.Element => {
  const rootBgColor = useColorModeValue("white", "blackAlpha.300")
  const dropdownBgColor = useColorModeValue("white", "gray.700")
  const dropdownBorderColor = useColorModeValue("gray.200", "gray.500")
  const dropdownShadow = useColorModeValue("lg", "dark-lg")
  const optionFocusBgColor = useColorModeValue("blackAlpha.100", "gray.600")

  const router = useRouter()

  const [activeFilters, dispatch] = useActiveFiltersReducer([])

  useEffect(() => {
    if (activeFilters.length > 0) return
    const initialFilters: Filter[] = Object.entries(router.query)
      .map(([key, value]) =>
        isSupportedQueryParam(key) && value
          ? {
              filter: key,
              value: value.toString(),
            }
          : null
      )
      .filter(Boolean)

    dispatch({
      type: "setFilters",
      filters: initialFilters,
    })

    setInputValue?.(router.query.search?.toString() ?? "")
  }, [router.query])

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

        const [filterNameOrSearch, filterValue = ""] = value.split(":")

        dispatch({
          type: "addFilter",
          filter: {
            filter: filterNameOrSearch as SupportedQueryParam,
            value: decodeURIComponent(filterValue),
          },
        })

        if (filterValue.length) setInputValue("")

        const nativeTagInput: HTMLInputElement = document.querySelector(
          `#combobox\\:filter-input-combobox #${filterNameOrSearch}`
        )
        nativeTagInput?.focus()
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
    inputValue,
    setInputValue,
    focus,
  } = combobox.connect(state, send, normalizeProps)

  const { size, ...filteredInputProps } = inputProps

  const [shouldRemoveLastFilter, setShouldRemoveLastFilter] = useState(false)

  const triggerSearch = () => {
    const query: ParsedUrlQuery = { ...router.query }

    const filters: SupportedQueryParam[] = [
      ...searchOptions.map((option) => option.value),
      "action",
    ]

    filters.forEach((filter) => {
      const relevantActiveFilter = activeFilters.find((f) => f.filter === filter)
      query[filter] = relevantActiveFilter?.value ?? ""
    })

    query.search = inputValue ?? ""

    Object.entries(query).forEach(([key, value]) => {
      if (!value) {
        delete query[key]
      }
    })

    router.push({
      pathname: router.pathname,
      query,
    })
  }

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      triggerSearch()
    }

    if (e.code !== "Backspace" || e.currentTarget.selectionStart !== 0) {
      setShouldRemoveLastFilter(false)
      return
    }

    if (shouldRemoveLastFilter) {
      dispatch({
        type: "removeLastFilter",
      })
      if (activeFilters.length < 1) setShouldRemoveLastFilter(false)
      return
    }

    setShouldRemoveLastFilter(true)
  }

  useEffect(() => {
    const foundSearchOption = searchOptions.find(({ label }) => label === inputValue)
    if (
      foundSearchOption &&
      activeFilters.find(({ filter }) => foundSearchOption.value === filter)
    )
      setInputValue("")
  }, [inputValue])

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
              {activeFilters?.map(({ filter, value }) => (
                <TagInput
                  key={filter}
                  filter={filter}
                  label={
                    searchOptions.find((option) => option.value === filter)?.label ??
                    "Action"
                  }
                  value={value}
                  onRemove={(filterToRemove) => {
                    dispatch({
                      type: "removeFilter",
                      filter: filterToRemove,
                    })
                    focus()
                  }}
                  onChange={(newFilter) =>
                    dispatch({ type: "updateFilter", filter: newFilter })
                  }
                  onEnter={focus}
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
                dispatch({ type: "clearFilters" })
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

      <Box
        bgColor={dropdownBgColor}
        borderColor={dropdownBorderColor}
        shadow={dropdownShadow}
        borderWidth={1}
        borderRadius="md"
        zIndex="modal"
        overflowY="auto"
        className="custom-scrollbar"
        {...positionerProps}
      >
        <Stack spacing={0} {...contentProps}>
          {inputValue?.length > 2 &&
            !activeFilters?.some((filter) => filter.filter === "action") &&
            auditLogActions
              .filter((action) => action.includes(inputValue.toLowerCase()))
              .map((action) => {
                // Need to encode it, because it's used as an ID in the DOM and it'll break the filter input if the ID contains spaces
                const value = `action:${encodeURIComponent(action)}`

                return (
                  <HStack
                    key={action}
                    {...getOptionProps({ label: action, value })}
                    px={4}
                    h={12}
                    bgColor={
                      focusedOption?.value === value ? optionFocusBgColor : undefined
                    }
                    _hover={{
                      bgColor: optionFocusBgColor,
                    }}
                    transition="0.16s ease"
                  >
                    <Text as="span" fontWeight="bold" flexShrink={0}>
                      {`Filter for actions: `}
                    </Text>
                    <ActionIcon action={action} size={6} />
                    <Text as="span" isTruncated>
                      {action}
                    </Text>
                  </HStack>
                )
              })}

          {searchOptions
            .filter(
              (option) => !activeFilters?.map((f) => f.filter).includes(option.value)
            )
            .map(({ label, description, value }) => (
              <HStack
                key={value}
                {...getOptionProps({ label, value })}
                px={4}
                h={12}
                bgColor={
                  focusedOption?.value === value ? optionFocusBgColor : undefined
                }
                _hover={{
                  bgColor: optionFocusBgColor,
                }}
                transition="0.16s ease"
              >
                <Text as="span" fontWeight="bold">{`${label}: `}</Text>
                <Text as="span" colorScheme="gray" fontWeight="normal">
                  {description}
                </Text>
              </HStack>
            ))}
        </Stack>
      </Box>
    </>
  )
}

export default FiltersInput
