import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useFormContext, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import GuildSelect from "../../common/GuildSelect"

type Props = {
  baseFieldPath: string
}

const Role = ({ baseFieldPath }: Props): JSX.Element => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const guildId = useWatch({ name: `${baseFieldPath}.data.guildId` })
  const roleId = useWatch({ name: `${baseFieldPath}.data.roleId` })

  const { isLoading, roles } = useGuild(guildId)

  const roleOptions =
    roles?.map((role) => ({
      img: role.imageUrl,
      label: role.name,
      value: role.id,
    })) ?? []

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

export default Role
