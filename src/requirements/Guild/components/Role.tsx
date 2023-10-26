import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useGuild from "components/[guild]/hooks/useGuild"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Guild } from "types"
import parseFromObject from "utils/parseFromObject"
import useGuilds from "../hooks/useGuilds"

type Props = {
  baseFieldPath: string
}

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.data?.details?.includes(input?.replace("https://guild.xyz/", ""))

const GUILD_URL_REGEX = /^[a-z0-9\-]*$/i

const Role = ({ baseFieldPath }: Props): JSX.Element => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const guildId = useWatch({ name: `${baseFieldPath}.data.guildId` })
  const roleId = useWatch({ name: `${baseFieldPath}.data.roleId` })

  const [searchValue, setSearchValue] = useState("")
  const debouncedSearchValue = useDebouncedState(searchValue)

  const { data: guildOptions, isValidating: isGuildsLoading } =
    useGuilds(debouncedSearchValue)

  const { isLoading, ...fetchedGuild } = useGuild(
    searchValue &&
      debouncedSearchValue?.replace("https://guild.xyz/", "").match(GUILD_URL_REGEX)
      ? debouncedSearchValue.replace("https://guild.xyz/", "")
      : guildId
  )
  const [foundGuild, setFoundGuild] = useState<Guild>()

  useEffect(() => {
    if (
      !fetchedGuild?.id ||
      (foundGuild?.isDetailed && fetchedGuild.id === foundGuild?.id)
    )
      return
    setFoundGuild(fetchedGuild)
  }, [fetchedGuild])

  const mergedGuildOptions = useMemo(() => {
    if (!guildOptions) return []

    if (foundGuild && !guildOptions?.find((g) => g.value === foundGuild.id))
      return [
        ...guildOptions,
        {
          img: foundGuild.imageUrl,
          label: foundGuild.name,
          value: foundGuild.id,
        },
      ]

    return guildOptions
  }, [guildOptions, foundGuild])

  const selectedGuild = mergedGuildOptions?.find((guild) => guild.value === guildId)

  const roleOptions =
    foundGuild?.roles?.map((role) => ({
      img: role.imageUrl,
      label: role.name,
      value: role.id,
    })) ?? []

  const selectedRole = roleOptions?.find((role) => role.value === roleId)

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.guildId?.message}
      >
        <FormLabel>Guild</FormLabel>

        <InputGroup>
          {selectedGuild?.img && (
            <InputLeftElement>
              <OptionImage
                img={selectedGuild?.img as string}
                alt={selectedGuild?.label}
              />
            </InputLeftElement>
          )}
          <ControlledSelect
            name={`${baseFieldPath}.data.guildId`}
            rules={{
              required: "Please select a guild",
              pattern: {
                value: GUILD_URL_REGEX,
                message: "Please input a valid Guild URL",
              },
            }}
            isLoading={isGuildsLoading || isLoading}
            options={mergedGuildOptions}
            beforeOnChange={() => resetField(`${baseFieldPath}.data.roleId`)}
            onInputChange={(newValue) => setSearchValue(newValue)}
            filterOption={customFilterOption}
          />
        </InputGroup>

        <FormHelperText>Select a guild or paste guild URL name</FormHelperText>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.guildId?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isDisabled={!guildId || isLoading}
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.roleId?.message}
      >
        <FormLabel>Role</FormLabel>

        <InputGroup>
          {selectedRole?.img && (
            <InputLeftElement>
              <OptionImage img={selectedRole?.img} alt={selectedRole?.label} />
            </InputLeftElement>
          )}

          <ControlledSelect
            name={`${baseFieldPath}.data.roleId`}
            rules={{
              required: "Please select a role",
              pattern: {
                value: /^[0-9]*$/i,
                message: "Please input a valid role ID",
              },
              validate: (value) =>
                !!roleOptions?.find((role) => role.value === value) ||
                "Please select a role",
            }}
            options={roleOptions}
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.roleId?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default Role
