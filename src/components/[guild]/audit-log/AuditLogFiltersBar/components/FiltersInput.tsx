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
import { CaretDown } from "phosphor-react"
import { KeyboardEvent, useEffect, useState } from "react"
import { SupportedQueryParam, SUPPORTED_QUERY_PARAMS } from "../../hooks/useAuditLog"
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
  SUPPORTED_QUERY_PARAMS.includes(arg as SupportedQueryParam)

const searchOptions: SearchOption[] = [
  {
    label: "User",
    description: "user ID",
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

const FiltersInput = (): JSX.Element => {
  const dropdownBgColor = useColorModeValue("white", "gray.700")
  const dropdownBorderColor = useColorModeValue("gray.200", "gray.500")
  const dropdownShadow = useColorModeValue("lg", "dark-lg")
  const optionFocusBgColor = useColorModeValue("blackAlpha.100", "gray.600")

  const router = useRouter()

  const [activeFilters, setActiveFilters] = useState<Filter[]>([])

  useEffect(() => {
    if (activeFilters.length > 0) return
    const initialFilters: Filter[] = Object.entries(router.query)
      .map(([key, value]) =>
        isSupportedQueryParam(key) && value
          ? { filter: key, value: value.toString() }
          : null
      )
      .filter(Boolean)

    setActiveFilters(initialFilters)
    setInputValue?.(router.query.search?.toString() ?? "")
  }, [router.query])

  const [search, setSearch] = useState(router.query.search?.toString() ?? "")

  const [state, send] = useMachine(
    combobox.machine({
      id: "filter-input-combobox",
      placeholder: "Filter by...",
      inputBehavior: "autohighlight",
      positioning: {
        placement: "bottom-start",
        sameWidth: true,
      },
      onSelect({ value: filterNameOrSearch }) {
        if (!isSupportedQueryParam(filterNameOrSearch)) return

        setActiveFilters((previousActiveFilters) => [
          ...previousActiveFilters,
          {
            filter: filterNameOrSearch,
            value: "",
          },
        ])
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
    selectedValue,
    setInputValue,
    focus,
  } = combobox.connect(state, send, normalizeProps)

  const { size, ...filteredInputProps } = inputProps

  useEffect(() => {
    const foundOption = searchOptions.find(
      (option) => option.label === inputValue && option.value === selectedValue
    )
    if (!foundOption) return

    setInputValue(search)
    const nativeTagInput: HTMLInputElement = document.querySelector(
      `#combobox\\:filter-input-combobox #${selectedValue}`
    )
    nativeTagInput?.focus()
  }, [selectedValue, inputValue])

  const onEnterKeyPress = (e: KeyboardEvent) => {
    if (e.code !== "Enter") return

    const query: typeof router.query = { ...router.query }

    searchOptions.forEach((option) => {
      const relevantActiveFilter = activeFilters.find(
        (f) => f.filter === option.value
      )
      query[option.value] = relevantActiveFilter ? relevantActiveFilter.value : ""
    })

    activeFilters.forEach(({ filter, value }) => (query[filter] = value))

    if (search) query.search = search

    Object.entries(query).forEach(([key, value]) => {
      if (!value) {
        delete query[key]
      }
    })

    router.replace({
      pathname: router.pathname,
      query,
    })
  }

  return (
    <>
      <Box
        h={10}
        px={2}
        bgColor="blackAlpha.300"
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
                  name={filter}
                  value={value}
                  onRemove={(filterToRemove) => {
                    setActiveFilters((previousActiveFilters) => [
                      ...previousActiveFilters.filter(
                        (f) => f.filter !== filterToRemove
                      ),
                    ])
                    focus()
                  }}
                  onChange={(newFilter) =>
                    setActiveFilters((previousFilters) => {
                      const modifiedFilters = [...previousFilters]
                      const filterToModify = modifiedFilters.find(
                        (f) => f.filter === newFilter.filter
                      )
                      if (filterToModify) {
                        filterToModify.value = newFilter.value
                      }

                      return modifiedFilters
                    })
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
              onKeyUp={onEnterKeyPress}
              {...filteredInputProps}
              onChange={(e) => {
                setSearch(e.target.value)

                filteredInputProps.onChange(e)
              }}
            />
          </Flex>

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
          {inputValue?.length > 0 && (
            <HStack
              {...getOptionProps({ label: inputValue, value: inputValue })}
              px={4}
              h={12}
              bgColor={
                focusedOption?.value === inputValue ? optionFocusBgColor : undefined
              }
              _hover={{
                bgColor: optionFocusBgColor,
              }}
              transition="0.16s ease"
            >
              <Text as="span" fontWeight="bold" flexShrink={0}>
                {`Search for: `}
              </Text>
              <Text as="span" isTruncated>
                {inputValue}
              </Text>
            </HStack>
          )}
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
