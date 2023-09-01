import {
  Center,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Tag,
  TagProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import * as combobox from "@zag-js/combobox"
import { normalizeProps, useMachine } from "@zag-js/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { X } from "phosphor-react"
import platforms from "platforms/platforms"
import { PropsWithChildren, useRef, useState } from "react"
import { PlatformType } from "types"
import capitalize from "utils/capitalize"
import fetcher from "utils/fetcher"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import ActionIcon from "../../ActivityLogAction/components/ActionIcon"
import RewardTag from "../../ActivityLogAction/components/RewardTag"
import RoleTag from "../../ActivityLogAction/components/RoleTag"
import UserTag from "../../ActivityLogAction/components/UserTag"
import { ACTION } from "../../constants"
import { filterNames, useActivityLogFilters } from "./ActivityLogFiltersContext"
import Dropdown from "./Dropdown"
import DynamicWidthInput from "./DynamicWidthInput"
import Suggestion from "./Suggestion"

type Props = {
  filterId: string
  focusFiltersInput: () => void
  positionerStyle: Record<string, string>
} & TagProps

const FilterTag = ({
  filterId,
  focusFiltersInput,
  positionerStyle,
  ...tagProps
}: PropsWithChildren<Props>): JSX.Element => {
  const tagFontColor = useColorModeValue("black", undefined)
  const closeBtnFocusBgColor = useColorModeValue("blackAlpha.300", "whiteAlpha.500")

  const {
    getFilter,
    updateFilter,
    removeFilter,
    getFilteredRoleSuggestions,
    getFilteredRewardSuggestions,
    getFilteredActionSuggestions,
  } = useActivityLogFilters()
  const { id, filter, value } = getFilter(filterId)

  const { roles, guildPlatforms } = useGuild()

  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [shouldRemove, setShouldRemove] = useState(value.length === 0)

  const [state, send] = useMachine(
    combobox.machine({
      id: `tag-${id}-combobox`,
      inputBehavior: "autohighlight",
      onSelect({ value: selectedValue }) {
        updateFilter({
          id,
          filter,
          value: selectedValue?.trim() ?? "",
        })
        focusFiltersInput()
      },
      openOnClick: true,
      autoFocus: true,
    })
  )

  const {
    rootProps,
    controlProps,
    inputProps,
    positionerProps,
    contentProps,
    getOptionProps,
    focusedOption,
    inputValue,
    setInputValue,
  } = combobox.connect(state, send, normalizeProps)

  const onChange = async (e) => {
    const newValue = e.target.value

    if (filter !== "userId") {
      setInputValue(newValue)
      return
    }

    const trimmedValue = newValue.trim()
    if (ADDRESS_REGEX.test(trimmedValue)) {
      setIsLoading(true)
      try {
        const guildUser = await fetcher(`/v2/users/${trimmedValue}`)
        setInputValue(guildUser.id)
      } catch {
        setInputValue(trimmedValue)
      } finally {
        setIsLoading(false)
      }
    } else {
      setInputValue(trimmedValue)
    }
  }

  return (
    <>
      <Tag
        color={tagFontColor}
        position="relative"
        borderColor="transparent"
        onClick={() => inputRef.current?.focus()}
        pr={0}
        {...tagProps}
        {...rootProps}
      >
        <HStack {...controlProps}>
          <Text as="span" fontSize="sm" fontWeight="bold">
            {filterNames[filter]}:
          </Text>

          {value ? (
            <>
              {(() => {
                switch (filter) {
                  case "action":
                    return (
                      <HStack spacing={0.5} pr={6}>
                        <ActionIcon
                          action={value as ACTION}
                          size={4}
                          position="relative"
                        />
                        <Text as="span" minW="max-content">
                          {capitalize(value)}
                        </Text>
                      </HStack>
                    )
                  case "roleId": {
                    const role = roles?.find((r) => r.id === Number(value))
                    return (
                      <RoleTag
                        name={role?.name ?? "Unknown role"}
                        image={role?.imageUrl}
                        pr={6}
                        borderLeftRadius={0}
                      />
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
                    )
                  }
                  case "userId":
                    return (
                      <UserTag userId={Number(value)} pr={7} borderLeftRadius={0} />
                    )
                  default:
                    return null
                }
              })()}
            </>
          ) : (
            <DynamicWidthInput
              ref={inputRef}
              variant="unstyled"
              borderRadius="none"
              pr={6}
              {...(inputProps as any)}
              value={inputValue}
              defaultValue={undefined}
              onChange={onChange}
              onKeyUp={(e) => {
                if (e.currentTarget.value.length > 0 && e.code === "Enter") {
                  updateFilter({ id, filter, value: inputValue })
                  focusFiltersInput()
                }

                if (
                  e.currentTarget.value.length === 0 &&
                  e.code === "Backspace" &&
                  shouldRemove
                ) {
                  removeFilter({ id, filter })
                  focusFiltersInput()
                }

                setShouldRemove(e.currentTarget.value.length === 0)
              }}
            />
          )}
        </HStack>

        {isLoading ? (
          <Spinner
            size="xs"
            position="absolute"
            top="calc(var(--chakra-space-1-5) - var(--chakra-space-0-5) / 2)"
            right={1}
          />
        ) : (
          <IconButton
            position="absolute"
            top={1}
            right={1}
            aria-label="Remove filter"
            icon={<X />}
            size="xs"
            boxSize={4}
            minW={4}
            minH={4}
            onClick={() => {
              removeFilter({ id: filterId, filter })
              focusFiltersInput()
            }}
            _focusVisible={{
              bgColor: closeBtnFocusBgColor,
              boxShadow: "none",
            }}
          />
        )}
      </Tag>

      {["roleId", "rolePlatformId", "action"].includes(filter) && (
        <Dropdown
          {...{
            ...positionerProps,
            style: { ...positionerProps.style, ...positionerStyle },
          }}
        >
          <Stack spacing={0} {...contentProps}>
            {(() => {
              switch (filter) {
                case "roleId": {
                  const roleSuggestions = getFilteredRoleSuggestions(inputValue)

                  return (
                    <>
                      {!roleSuggestions.length && <NoResults />}
                      {roleSuggestions.map((roleSuggestion) => {
                        const suggestionLabel = "Role"

                        return (
                          <Suggestion
                            key={roleSuggestion.id}
                            label={suggestionLabel}
                            isFocused={
                              focusedOption?.value === roleSuggestion.id.toString()
                            }
                            {...getOptionProps({
                              label: suggestionLabel,
                              value: roleSuggestion.id.toString(),
                            })}
                          >
                            <RoleTag
                              image={roleSuggestion.imageUrl}
                              name={roleSuggestion.name}
                            />
                          </Suggestion>
                        )
                      })}
                    </>
                  )
                }
                case "rolePlatformId": {
                  const rewardSuggestions = getFilteredRewardSuggestions(inputValue)

                  return (
                    <>
                      {!rewardSuggestions.length && <NoResults />}
                      {rewardSuggestions.map((rewardSuggestion) => {
                        const suggestionLabel = "Reward"

                        return (
                          <Suggestion
                            key={rewardSuggestion.rolePlatformId}
                            label={suggestionLabel}
                            isFocused={
                              focusedOption?.value ===
                              rewardSuggestion.rolePlatformId.toString()
                            }
                            {...getOptionProps({
                              label: suggestionLabel,
                              value: rewardSuggestion.rolePlatformId.toString(),
                            })}
                          >
                            <RewardTag
                              icon={platforms[rewardSuggestion.platformName].icon}
                              name={rewardSuggestion.name}
                              colorScheme={
                                platforms[rewardSuggestion.platformName].colorScheme
                              }
                            />
                          </Suggestion>
                        )
                      })}
                    </>
                  )
                }
                case "action": {
                  const actionSuggestions = getFilteredActionSuggestions(inputValue)

                  return (
                    <>
                      {!actionSuggestions.length && <NoResults />}
                      {actionSuggestions.map((action) => (
                        <Suggestion
                          key={action}
                          label="Action"
                          isFocused={focusedOption?.value === action}
                          {...getOptionProps({
                            label: capitalize(action),
                            value: action,
                          })}
                        >
                          <Text as="span" isTruncated>
                            {action}
                          </Text>
                          <ActionIcon action={action} size={6} />
                        </Suggestion>
                      ))}
                    </>
                  )
                }
                default:
                  return null
              }
            })()}
          </Stack>
        </Dropdown>
      )}
    </>
  )
}

const NoResults = (): JSX.Element => (
  <Center p={4} color="gray.500">
    <Text as="span" colorScheme="gray">
      No results
    </Text>
  </Center>
)

export default FilterTag
