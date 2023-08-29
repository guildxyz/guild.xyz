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
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { CaretDown, X } from "phosphor-react"
import platforms from "platforms/platforms"
import { ParsedUrlQuery } from "querystring"
import { KeyboardEvent, useEffect, useState } from "react"
import { PlatformType } from "types"
import capitalize from "utils/capitalize"
import ActionIcon from "../../ActivityLogAction/components/ActionIcon"
import RewardTag from "../../ActivityLogAction/components/RewardTag"
import RoleTag from "../../ActivityLogAction/components/RoleTag"
import {
  SupportedQueryParam,
  SUPPORTED_QUERY_PARAMS,
} from "../../ActivityLogContext"
import { ACTION } from "../../constants"
import FilterTag from "./FilterTag"
import { useActiveFiltersReducer } from "./hooks/useActiveFiltersReducer"
import Suggestion from "./Suggestion"
import SuggestionsSection from "./SuggestionsSection"
import TagInput from "./TagInput"

type SearchOption = {
  label: string
  value: SupportedQueryParam
}

export type Filter = {
  filter: SupportedQueryParam
  value?: string
}

const isSupportedQueryParam = (arg: any): arg is SupportedQueryParam =>
  typeof arg === "string" &&
  (SUPPORTED_QUERY_PARAMS.includes(arg as SupportedQueryParam) ||
    SUPPORTED_QUERY_PARAMS.includes(arg.split(":")[0] as SupportedQueryParam))

const possibleSearchOptions: SearchOption[] = [
  {
    label: "User",
    value: "userId",
  },
  {
    label: "Role",
    value: "roleId",
  },
  {
    label: "Requirement",
    value: "requirementId",
  },
  {
    label: "Reward",
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

    setInputValue?.("")
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
      ...possibleSearchOptions.map((option) => option.value),
      "action",
    ]

    filters.forEach((filter) => {
      const relevantActiveFilter = activeFilters.find((f) => f.filter === filter)
      query[filter] = relevantActiveFilter?.value ?? ""
    })

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
    const foundSearchOption = possibleSearchOptions.find(
      ({ label }) => label === inputValue
    )
    if (
      foundSearchOption &&
      activeFilters.find(({ filter }) => foundSearchOption.value === filter)
    )
      setInputValue("")
  }, [inputValue])

  // Search suggestions related logic
  const { guildPlatforms, roles } = useGuild()

  const rewardSuggestions = roles
    ?.flatMap((role) => role.rolePlatforms)
    .map((rp) => {
      const role = roles.find((r) => r.id === rp.roleId)
      const guildPlatform = guildPlatforms.find((gp) => gp.id === rp.guildPlatformId)
      const name =
        guildPlatform?.platformGuildName ?? guildPlatform?.platformGuildData?.name

      return {
        id: rp.id,
        platformName: PlatformType[guildPlatform?.platformId],
        name:
          guildPlatform?.platformId === PlatformType.DISCORD
            ? `${role.name} - ${name}`
            : name,
      }
    })
    .filter((reward) => {
      const lowerCaseInputValue = inputValue?.trim().toLowerCase()

      if (!lowerCaseInputValue) return true

      return (
        reward.name.toLowerCase().includes(lowerCaseInputValue) ||
        "reward".includes(lowerCaseInputValue)
      )
    })
  const shouldRenderRewardSuggestions =
    rewardSuggestions?.length > 0 &&
    !activeFilters?.some((af) => af.filter === "rolePlatformId")

  const roleSuggestions = roles?.filter((role) => {
    const lowerCaseInputValue = inputValue?.trim().toLowerCase()
    return (
      role.name.toLowerCase().includes(lowerCaseInputValue) ||
      "role".includes(lowerCaseInputValue)
    )
  })
  const shouldRenderRoleSuggestions =
    roleSuggestions?.length > 0 &&
    !activeFilters?.some((af) => af.filter === "roleId")

  const actionSuggestions = auditLogActions.filter((action) => {
    const lowerCaseInputValue = inputValue.toLowerCase()
    return (
      action.includes(lowerCaseInputValue) || "action".includes(lowerCaseInputValue)
    )
  })
  const shouldRenderActionSuggestions =
    actionSuggestions.length > 0 &&
    !activeFilters?.some((af) => af.filter === "action")

  const shouldRenderUserIdFilterOption = !activeFilters?.some(
    (af) => af.filter === "userId"
  )

  const isFiltersInputEnabled =
    shouldRenderRoleSuggestions ||
    shouldRenderRewardSuggestions ||
    shouldRenderActionSuggestions ||
    shouldRenderUserIdFilterOption

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
              {activeFilters?.map(({ filter, value }) => {
                switch (filter) {
                  case "action":
                    return (
                      <FilterTag
                        label="Action:"
                        onRemove={() => {
                          dispatch({
                            type: "removeFilter",
                            filter: {
                              filter,
                            },
                          })
                          focus()
                        }}
                      >
                        <HStack spacing={0.5}>
                          <ActionIcon
                            action={value as ACTION}
                            size={4}
                            position="relative"
                          />
                          <Text as="span" minW="max-content">
                            {capitalize(value)}
                          </Text>
                        </HStack>
                      </FilterTag>
                    )
                  case "roleId": {
                    const role = roles?.find((r) => r.id === Number(value))
                    return (
                      <FilterTag
                        label="Role"
                        onRemove={() => {
                          dispatch({
                            type: "removeFilter",
                            filter: {
                              filter,
                            },
                          })
                          focus()
                        }}
                        pr={0}
                      >
                        <RoleTag
                          name={role?.name ?? "Unknown role"}
                          image={role?.imageUrl}
                          pr={7}
                          borderLeftRadius={0}
                        />
                      </FilterTag>
                    )
                  }
                  case "rolePlatformId": {
                    const role = roles?.find((r) =>
                      r.rolePlatforms.some((rp) => rp.id === Number(value))
                    )
                    const rolePlatform = roles
                      ?.flatMap((r) => r.rolePlatforms)
                      .find((rp) => rp.id === Number(value))
                    const guildPlatform = guildPlatforms?.find(
                      (gp) => gp.id === rolePlatform?.guildPlatformId
                    )
                    const name =
                      guildPlatform?.platformGuildName ??
                      guildPlatform?.platformGuildData?.name

                    return (
                      <FilterTag
                        label="Role"
                        onRemove={() => {
                          dispatch({
                            type: "removeFilter",
                            filter: {
                              filter,
                            },
                          })
                          focus()
                        }}
                        pr={0}
                        closeButtonProps={{
                          colorScheme: "whiteAlpha",
                        }}
                      >
                        <RewardTag
                          name={
                            guildPlatform?.platformId === PlatformType.DISCORD
                              ? `${role.name} - ${name}`
                              : name
                          }
                          icon={
                            platforms[PlatformType[guildPlatform?.platformId]]?.icon
                          }
                          colorScheme={
                            platforms[PlatformType[guildPlatform?.platformId]]
                              ?.colorScheme
                          }
                          pr={7}
                          borderLeftRadius={0}
                        />
                      </FilterTag>
                    )
                  }
                  case "after":
                  case "before":
                    return null
                  default:
                    return (
                      <TagInput
                        key={filter}
                        filter={filter}
                        label={
                          possibleSearchOptions.find(
                            (option) => option.value === filter
                          )?.label ?? "Action"
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
                    )
                }
              })}
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
        maxH="50vh"
        className="custom-scrollbar"
        {...positionerProps}
      >
        <Stack spacing={0} {...contentProps}>
          {!isFiltersInputEnabled && (
            <Text colorScheme="gray" p={4}>
              You can't use any more filters
            </Text>
          )}

          {shouldRenderUserIdFilterOption && (
            <Suggestion
              label="User"
              isFocused={focusedOption?.value === "userId"}
              {...getOptionProps({ label: "User", value: "userId" })}
            >
              <Text as="span" colorScheme="gray" fontWeight="normal">
                Paste user's wallet address
              </Text>
            </Suggestion>
          )}

          {shouldRenderRewardSuggestions && (
            <SuggestionsSection title="Filter by reward">
              {rewardSuggestions.map((suggestion) => {
                const label = "Reward"

                return (
                  <Suggestion
                    key={suggestion.id}
                    label={label}
                    isFocused={
                      focusedOption?.value === `rolePlatformId:${suggestion.id}`
                    }
                    {...getOptionProps({
                      label,
                      value: `rolePlatformId:${suggestion.id}`,
                    })}
                  >
                    <RewardTag
                      icon={platforms[suggestion.platformName].icon}
                      name={suggestion.name}
                      colorScheme={platforms[suggestion.platformName].colorScheme}
                    />
                  </Suggestion>
                )
              })}
            </SuggestionsSection>
          )}

          {shouldRenderRoleSuggestions && (
            <SuggestionsSection title="Filter by role">
              {roleSuggestions.map((suggestion) => {
                const label = "Role"

                return (
                  <Suggestion
                    key={suggestion.id}
                    label={label}
                    isFocused={focusedOption?.value === `roleId:${suggestion.id}`}
                    {...getOptionProps({
                      label,
                      value: `roleId:${suggestion.id}`,
                    })}
                  >
                    <RoleTag image={suggestion.imageUrl} name={suggestion.name} />
                  </Suggestion>
                )
              })}
            </SuggestionsSection>
          )}

          {shouldRenderActionSuggestions && (
            <SuggestionsSection title="Filter by action">
              {actionSuggestions.map((action) => {
                // Need to encode it, because it's used as an ID in the DOM and it'll break the filter input if the ID contains spaces
                const value = `action:${encodeURIComponent(action)}`

                return (
                  <Suggestion
                    key={action}
                    label="Action"
                    isFocused={focusedOption?.value === value}
                    {...getOptionProps({
                      label: action,
                      value,
                    })}
                  >
                    <Text as="span" isTruncated>
                      {action}
                    </Text>
                    <ActionIcon action={action} size={6} />
                  </Suggestion>
                )
              })}
            </SuggestionsSection>
          )}
        </Stack>
      </Box>
    </>
  )
}

export default FiltersInput
