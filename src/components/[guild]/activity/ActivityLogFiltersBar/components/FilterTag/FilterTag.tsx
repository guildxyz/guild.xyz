import {
  HStack,
  Icon,
  IconButton,
  Input,
  Spinner,
  Stack,
  Tag,
  TagProps,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import * as combobox from "@zag-js/combobox"
import { normalizeProps, useMachine } from "@zag-js/react"
import ActivityLogRoleTag from "../../../ActivityLogAction/components/ActivityLogRoleTag"

import FormTag from "components/[guild]/activity/ActivityLogAction/components/FormTag"
import GuildTag from "components/[guild]/activity/ActivityLogAction/components/GuildTag"
import { useActivityLog } from "components/[guild]/activity/ActivityLogContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { Warning, X } from "phosphor-react"
import { PropsWithChildren, useEffect, useState } from "react"
import { PlatformName, PlatformType } from "types"
import capitalize from "utils/capitalize"
import fetcher from "utils/fetcher"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import ActionIcon from "../../../ActivityLogAction/components/ActionIcon"
import RewardTag from "../../../ActivityLogAction/components/RewardTag"
import UserTag from "../../../ActivityLogAction/components/UserTag"
import { ACTION } from "../../../constants"
import { FILTER_NAMES, useActivityLogFilters } from "../ActivityLogFiltersContext"
import Dropdown from "../Dropdown"
import ActionSuggestons from "./components/ActionSuggestons"
import GuildSuggestions from "./components/GuildSuggestions"
import RewardSuggestions from "./components/RewardSuggestions"
import RoleSuggestions from "./components/RoleSuggestions"

type Props = {
  filterId: string
  isFiltersInputFocused: boolean
  focusFiltersInput: () => void
  positionerStyle: Record<string, string>
} & TagProps

const FilterTag = ({
  filterId,
  isFiltersInputFocused,
  focusFiltersInput,
  positionerStyle,
  ...tagProps
}: PropsWithChildren<Props>): JSX.Element => {
  const tagFontColor = useColorModeValue("black", undefined)
  const closeBtnFocusBgColor = useColorModeValue("blackAlpha.300", "whiteAlpha.500")

  const { activeFilters, getFilter, updateFilter, removeFilter } =
    useActivityLogFilters()

  const { activityLogType } = useActivityLog()
  const isSuperadminActivityLog = activityLogType === "all"

  const filterGuildId = isSuperadminActivityLog
    ? activeFilters?.find((af) => af.filter === "guildId")?.value
    : undefined

  const { id, filter, value } = getFilter(filterId)

  const { id: guildId, roles, guildPlatforms } = useGuild(filterGuildId)

  const [isLoading, setIsLoading] = useState(false)
  const [shouldRemove, setShouldRemove] = useState(value?.length === 0)

  const [inputError, setInputError] = useState<string>(null)

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
      autoFocus: isFiltersInputFocused,
      loop: true,
    })
  )

  const {
    rootProps,
    controlProps,
    inputProps,
    positionerProps,
    contentProps,
    getOptionProps,
    inputValue,
    setInputValue,
    focus,
    isFocused,
  } = combobox.connect(state, send, normalizeProps)

  useEffect(() => {
    if (!isFocused || !!value) return
    // Opening the suggestions dropdown
    send({ type: "CLICK_INPUT" })
  }, [isFocused, value, send])

  const { size, ...filteredInputProps } = inputProps

  const onChange = async (e) => {
    setInputError(null)
    const newValue = e.target.value

    if (filter !== "userId") {
      setInputValue(newValue)
      return
    }

    const trimmedValue = newValue.trim()
    setInputValue(trimmedValue)

    if (ADDRESS_REGEX.test(trimmedValue)) {
      setIsLoading(true)
      try {
        const guildUser = await fetcher(`/v2/users/${trimmedValue}`)
        const newInputValue = guildUser.id.toString()
        setInputValue(newInputValue)
        updateFilter({ id, filter, value: newInputValue })
        focusFiltersInput()
      } catch {
        // We just leave the original content of the input
        setInputError("User doesn't exist")
      } finally {
        setIsLoading(false)
      }
    } else if (trimmedValue.startsWith("0x")) {
      setInputError("Invalid address")
    }
  }

  const getRewardTagProps = () => {
    const role = roles?.find((r) =>
      r.rolePlatforms.some((rp) => rp.id === Number(value))
    )
    const rolePlatform = role?.rolePlatforms.find((rp) => rp.id === Number(value))
    const guildPlatform = guildPlatforms?.find(
      (gp) => gp.id === rolePlatform.guildPlatformId
    )

    const name =
      guildPlatform?.platformGuildName ?? guildPlatform?.platformGuildData?.name

    return {
      rolePlatformId: Number(value),
      platformType: PlatformType[guildPlatform?.platformId] as PlatformName,
      label:
        guildPlatform?.platformId === PlatformType.DISCORD
          ? `${role.name} - ${name}`
          : name,
      roleId: role?.id,
    }
  }

  return (
    <>
      <Tag
        color={tagFontColor}
        position="relative"
        borderColor="transparent"
        onClick={() => focus()}
        pr={0}
        {...tagProps}
        {...rootProps}
      >
        <HStack {...controlProps}>
          {inputError && (
            <Tooltip label={inputError} placement="top" hasArrow>
              <Icon as={Warning} color="red.500" boxSize={3} />
            </Tooltip>
          )}

          <Text as="span" fontSize="sm" fontWeight="bold">
            {FILTER_NAMES[filter]}:
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
                  case "guildId": {
                    return (
                      <GuildTag
                        guildId={Number(value)}
                        pr={6}
                        borderLeftRadius={0}
                      />
                    )
                  }
                  case "roleId": {
                    return (
                      <ActivityLogRoleTag
                        roleId={Number(value)}
                        guildId={guildId}
                        pr={6}
                        borderLeftRadius={0}
                      />
                    )
                  }
                  case "rolePlatformId": {
                    return (
                      <RewardTag
                        {...getRewardTagProps()}
                        pr={7}
                        borderLeftRadius={0}
                      />
                    )
                  }
                  case "userId":
                    return (
                      <UserTag userId={Number(value)} pr={7} borderLeftRadius={0} />
                    )
                  case "formId":
                    return (
                      <FormTag formId={Number(value)} pr={7} borderLeftRadius={0} />
                    )
                  default:
                    return null
                }
              })()}
            </>
          ) : (
            <Input
              variant="unstyled"
              borderRadius="none"
              pr={6}
              {...filteredInputProps}
              htmlSize={size}
              boxSizing="content-box"
              width={`${inputValue?.length ?? 0}ch`}
              minW="px"
              fontFamily="monospace"
              value={inputValue}
              defaultValue={undefined}
              onChange={onChange}
              onKeyUp={(e) => {
                if (e.currentTarget.value.length > 0 && e.code === "Enter") {
                  if (!inputValue.startsWith("0x")) {
                    updateFilter({ id, filter, value: inputValue })
                  }
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

      {["guildId", "roleId", "rolePlatformId", "action"].includes(filter) &&
        !(isSuperadminActivityLog && filter == "guildId") && (
          <Dropdown
            {...{
              ...positionerProps,
              style: { ...positionerProps.style, ...positionerStyle },
            }}
          >
            <Stack spacing={0} {...contentProps}>
              {(() => {
                switch (filter) {
                  case "guildId":
                    return (
                      <GuildSuggestions
                        inputValue={inputValue}
                        getOptionProps={getOptionProps}
                      />
                    )
                  case "roleId":
                    return (
                      <RoleSuggestions
                        guildId={guildId}
                        inputValue={inputValue}
                        getOptionProps={getOptionProps}
                      />
                    )
                  case "rolePlatformId":
                    return (
                      <RewardSuggestions
                        guildId={guildId}
                        inputValue={inputValue}
                        getOptionProps={getOptionProps}
                      />
                    )
                  case "action":
                    return (
                      <ActionSuggestons
                        inputValue={inputValue}
                        getOptionProps={getOptionProps}
                      />
                    )
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

export default FilterTag
