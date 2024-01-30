import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useFormContext, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import GuildSelect from "../../common/GuildSelect"
import { ControlledTimestampInput } from "../../../components/common/TimestampInput"
import { ControlledRelativeTimeInput } from "../../../components/common/RelativeTimeInput"
import { useMemo } from "react"

type Props = {
  baseFieldPath: string
  isRelative?: boolean
}

const Role = ({ baseFieldPath, isRelative = false }: Props): JSX.Element => {
  const {
    formState: { errors },
  } = useFormContext()

  const guildId = useWatch({ name: `${baseFieldPath}.data.guildId` })
  const roleId = useWatch({ name: `${baseFieldPath}.data.roleId` })
  const maxAmount = useWatch({ name: `${baseFieldPath}.data.maxAmount` })

  const { isLoading, roles } = useGuild(guildId)

  const roleOptions = useMemo(
    () =>
      roles
        ?.filter((role) => {
          const createdAt = role.createdAt ? new Date(role.createdAt) : null
          return !isRelative && maxAmount && createdAt ? maxAmount < createdAt : true
        })
        .map((role) => ({
          img: role.imageUrl,
          label: role.name,
          value: role.id,
        })) ?? [],
    [roles, isRelative, maxAmount]
  )

  const selectedRole = roleOptions?.find((role) => role.value === roleId)

  return (
    <>
      <GuildSelect baseFieldPath={baseFieldPath} />
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

export const RoleWithRangeFilter = ({ baseFieldPath }) => (
  <>
    <Role baseFieldPath={baseFieldPath} />
    <Stack w="full" gap={0}>
      <FormLabel>Have a role since</FormLabel>
      <ControlledTimestampInput fieldName={`${baseFieldPath}.data.maxAmount`} />
    </Stack>
  </>
)

export const RoleWithRelativeRangeFilter = ({ baseFieldPath }) => {
  const {
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <Role baseFieldPath={baseFieldPath} isRelative />
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.maxAmount}
      >
        <FormLabel>Have a role for</FormLabel>

        <InputGroup>
          <ControlledRelativeTimeInput
            isRequired
            fieldName={`${baseFieldPath}.data.maxAmount`}
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.maxAmount}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}
